import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import envConfig from "./envConfig.js";
import { User } from "../modules/user/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

passport.use(
    new GoogleStrategy(
        {
            clientID: envConfig.GOOGLE_CLIENT_ID,
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
            callbackURL: envConfig.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ email: profile._json.email });

                const DEFAULT_AVATAR = "https://res.cloudinary.com/dvhx3ldwz/image/upload/v1753431847/default-user-avatar_n9m7g8.png";
                const googleAvatar =
                    profile.photos?.[0]?.value ||
                    profile._json?.picture ||
                    DEFAULT_AVATAR;

                if (!user) {
                    // Create new user if they don't exist
                    const randomPassword = crypto.randomBytes(16).toString("hex");
                    const securePass = await bcrypt.hash(randomPassword, Number(envConfig.SALT_VALUE));

                    user = await User.create({
                        name: profile.displayName,
                        email: profile._json.email,
                        password: securePass,
                        avatarUrl: googleAvatar,
                    });
                } else if (!user.avatarUrl || user.avatarUrl === DEFAULT_AVATAR) {
                    // Update avatar for existing users who are missing one
                    user.avatarUrl = googleAvatar;
                    await user.save();
                }

                return done(null, user);
            } catch (error: any) {
                return done(error, false);
            }
        }
    )
);

export default passport;
