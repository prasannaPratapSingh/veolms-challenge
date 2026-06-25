import { Types } from "mongoose";

export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface IPayment {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paidAt: Date;
}

export interface ICreateOrderBody {
    courseId: string;
}

export interface IVerifyPaymentBody {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    courseId: string;
}
