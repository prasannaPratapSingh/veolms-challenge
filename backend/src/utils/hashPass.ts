import bcrypt from "bcryptjs";
import ApiError from "./ApiError.js";
import envConfig from "../config/envConfig.js";

const hashPass = async (password: string) => {
    try {
        const hashedPass = await bcrypt.hash(password, Number(envConfig.SALT_VALUE));
        return hashedPass;
    } catch (err) {
        throw new ApiError(400, "something went wrong in hashing");
    }
}

export default hashPass;