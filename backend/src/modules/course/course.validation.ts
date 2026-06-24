import { z } from "zod";

export const uploadCourseSchema = z.object({
    body: z.object({
        title: z.string({ error: "Title is required" }).min(1, "Title cannot be empty"),
        description: z.string({ error: "Description is required" }).min(1, "Description cannot be empty"),
        price: z.coerce.number({ error: "Price is required" }).min(0, "Price must be at least 0"),
        isPublished: z.union([z.boolean(), z.string().transform(val => val === 'true')]).optional(),
        createdBy: z.string({ error: "Educator is required!" }).min(1, "Educator name cannot be empty"),
    })
});
