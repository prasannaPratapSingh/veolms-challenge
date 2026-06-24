import { z } from "zod";

export const createSectionSchema = z.object({
    body: z.object({
        title: z.string({ error: "Title is required" }).min(1, "Title cannot be empty"),
        courseId: z.string({ error: "Course ID is required" }).min(1, "Course ID cannot be empty"),
        order: z.coerce.number().min(0, "Order must be at least 0").optional(),
    })
});

export const updateSectionSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title cannot be empty").optional(),
        courseId: z.string().min(1, "Course ID cannot be empty").optional(),
        order: z.coerce.number().min(0, "Order must be at least 0").optional(),
    })
});
