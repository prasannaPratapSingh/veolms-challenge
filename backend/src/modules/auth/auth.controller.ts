import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { IRegisterBody, ILoginBody } from "./auth.types.js";
import ApiError from "../../utils/ApiError.js";
import { User } from "../user/user.model.js";
import hashPass from "../../utils/hashPass.js";
import ApiResponse from "../../utils/ApiResponse.js";
import envConfig from "../../config/envConfig.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "./auht.utils.js";
import { redisClient } from "../../infrastructure/redis/redis.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";



interface CustomJwtPayload extends JwtPayload {
    id: string;
}

const isProd = envConfig.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' as const : 'lax' as const,
    path: '/',
};

// For clearCookie, set expires in the past — most reliable cross-browser approach
const clearCookieOptions = {
    path: '/',
    expires: new Date(0),
};

export const register = asyncHandler(async (
    req: Request<{}, {}, IRegisterBody>,
    res: Response,
    next: NextFunction
) => {

    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            throw new ApiError(400, "All fields are required")
        }

        const isExisted = await User.findOne({ email });

        if (isExisted) {
            throw new ApiError(400, "User with this email already exists");
        }

        const securePass = await hashPass(password);
        const user = await User.create({ email, password: securePass, name });
        return res.status(201).json(new ApiResponse(201, "Registration successful", user));
    } catch (error) {
        next(error);
    }
})

export const login = asyncHandler(async (
    req: Request<{}, {}, ILoginBody>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400, "All fields are required!");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found!");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials!");
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        user.refreshToken = await bcrypt.hash(refreshToken, Number(envConfig.SALT_VALUE));

        await user.save();


        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

        return res.status(200).json(new ApiResponse(200, "User logged in successfully", { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role }));

    } catch (error) {
        next(error);
    }
})

export const refreshToken =
    asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const refreshToken =
                req.cookies?.refreshToken;


            if (!refreshToken) {
                throw new ApiError(
                    401,
                    'Refresh token missing'
                );
            }

            // Check blacklist

            const isBlacklisted =
                await redisClient.get(
                    `blacklist:${refreshToken}`
                );

            if (isBlacklisted) {
                throw new ApiError(
                    403,
                    'Session revoked'
                );
            }

            try {
                // Verify refresh token

                const decoded =
                    jwt.verify(
                        refreshToken,
                        envConfig.REFRESH_TOKEN_SECRET
                    ) as CustomJwtPayload;

                // Find user

                const currUser =
                    await User.findById(
                        decoded.id
                    );

                if (!currUser) {
                    throw new ApiError(
                        404,
                        'User not found'
                    );
                }

                // Ensure refresh token exists in DB

                if (
                    !currUser.refreshToken
                ) {
                    throw new ApiError(
                        403,
                        'No active session found'
                    );
                }

                // Compare incoming token
                // with hashed DB token

                const isRefreshTokenValid =
                    await bcrypt.compare(
                        refreshToken,
                        currUser.refreshToken
                    );

                if (
                    !isRefreshTokenValid
                ) {
                    throw new ApiError(
                        403,
                        'Refresh token compromised'
                    );
                }

                // TOKEN ROTATION

                // Blacklist old refresh token

                const ttl =
                    decoded.exp! -
                    Math.floor(
                        Date.now() / 1000
                    );

                if (ttl > 0) {
                    await redisClient.setEx(
                        `blacklist:${refreshToken}`,
                        ttl,
                        'true'
                    );
                }

                // Generate NEW tokens

                const newAccessToken =
                    generateAccessToken(
                        decoded.id
                    );

                const newRefreshToken =
                    generateRefreshToken(
                        decoded.id
                    );

                // Hash NEW refresh token

                const hashedRefreshToken =
                    await bcrypt.hash(
                        newRefreshToken,
                        Number(envConfig.SALT_VALUE)
                    );

                // Save NEW hashed token in DB

                currUser.refreshToken =
                    hashedRefreshToken;

                await currUser.save();

                // Set cookies

                res.cookie(
                    'accessToken',
                    newAccessToken,
                    {
                        ...cookieOptions,
                        maxAge:
                            15 *
                            60 *
                            1000
                    }
                );

                res.cookie(
                    'refreshToken',
                    newRefreshToken,
                    {
                        ...cookieOptions,
                        maxAge:
                            7 *
                            24 *
                            60 *
                            60 *
                            1000
                    }
                );

                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            'Access token refreshed successfully'
                        )
                    );
            } catch (error) {
                if (
                    error instanceof
                    ApiError
                ) {
                    throw error;
                }

                throw new ApiError(
                    403,
                    'Invalid or expired refresh token'
                );
            }
        }
    );

export const logout = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {
        const refreshToken = req.cookies?.refreshToken;
        const accessToken  = req.cookies?.accessToken;

        // Blacklist the access token immediately so it can't be reused
        // even if the cookie clear fails on the client side.
        if (accessToken) {
            try {
                const decoded = jwt.decode(accessToken) as CustomJwtPayload | null;
                if (decoded?.exp) {
                    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
                    if (ttl > 0) {
                        await redisClient.setEx(`blacklist:${accessToken}`, ttl, 'true');
                    }
                }
            } catch {
                // ignore — still proceed with logout
            }
        }

        // Even if refresh token is missing, clear cookies and return
        if (!refreshToken) {
            res.clearCookie('accessToken', clearCookieOptions);
            res.clearCookie('refreshToken', clearCookieOptions);
            return res.status(200).json(
                new ApiResponse(200, 'User logged out successfully!')
            );
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                envConfig.REFRESH_TOKEN_SECRET
            ) as CustomJwtPayload;

            const currUser = await User.findById(decoded.id);

            if (currUser) {
                currUser.refreshToken = null;
                await currUser.save();
            }

            const ttl = decoded.exp! - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await redisClient.setEx(`blacklist:${refreshToken}`, ttl, 'true');
            }
        } catch {
            // ignore token verification errors — logout should still succeed
        }

        res.clearCookie('accessToken', clearCookieOptions);
        res.clearCookie('refreshToken', clearCookieOptions);

        return res.status(200).json(
            new ApiResponse(200, 'User logged out successfully!')
        );
    }
);

export const getMe = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        if (!req.user) {
            throw new ApiError(401, "Not authenticated!");
        }
        const userId = req.user.id;
        if (!userId) {
            throw new ApiError(400, "UserId not found!");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(400, "No such user exists!");
        }
        return res.status(200).json(new ApiResponse(200, "User data fetched successfully!", { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role }));

    } catch (error) {
        next(error);
    }

})