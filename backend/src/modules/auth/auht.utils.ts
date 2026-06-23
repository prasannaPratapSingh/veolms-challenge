import jwt from 'jsonwebtoken';
import envConfig from '../../config/envConfig.js';

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, envConfig.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, envConfig.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}