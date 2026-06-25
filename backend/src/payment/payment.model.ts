import mongoose, { Schema, Model } from "mongoose";
import { IPayment } from "./payment.type.js";

const paymentSchema: Schema<IPayment> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
    },
    razorpayPaymentId: {
        type: String,
        default: "",
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: "INR",
    },
    status: {
        type: String,
        enum: ["SUCCESS", "FAILED", "PENDING"],
        default: "PENDING",
    },
    paidAt: {
        type: Date,
    },
}, { timestamps: true });

export const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);
