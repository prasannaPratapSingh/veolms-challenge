import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../modules/user/user.model.js";
import { UserRole } from "../modules/user/user.interface.js";

export const isAdmin = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(401, "Unauthorized")
        }

        const id = user.id;

        const currUser = await User.findById(id);

        if (!currUser) {
            throw new ApiError(404, "User not found!");
        }
        if (currUser.role !== UserRole.ADMIN) {
            throw new ApiError(401, "Unauthorized!");
        }
        next();
    } catch (error) {
        next(error);
    }
})