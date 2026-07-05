import { rateLimit } from 'express-rate-limit';


const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false }
})

const moderateAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false }
})

const generalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false }
});


export { strictAuthLimiter, moderateAuthLimiter, generalApiLimiter }