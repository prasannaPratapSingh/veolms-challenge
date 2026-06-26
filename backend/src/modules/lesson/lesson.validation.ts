import { z } from "zod";

export const createLessonSchema = z.object({
    body: z.object({
        title: z.string({ error: "Title is required" }).min(1, "Title cannot be empty"),
        description: z.string({ error: "Description is required" }).min(1, "Description cannot be empty"),
        videoUrl: z.string().optional(),
        duration: z.coerce.number({ error: "Duration is required" }).min(0, "Duration must be at least 0"),
        sectionId: z.string({ error: "Section ID is required" }).min(1, "Section ID cannot be empty"),
        isPreview: z.union([z.boolean(), z.string().transform(val => val === "true")]).optional(),
        order: z.coerce.number().min(0, "Order must be at least 0").optional(),
    })
});

export const updateLessonSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title cannot be empty").optional(),
        description: z.string().min(1, "Description cannot be empty").optional(),
        videoUrl: z.string().min(1, "Video URL cannot be empty").optional(),
        duration: z.coerce.number().min(0, "Duration must be at least 0").optional(),
        sectionId: z.string().min(1, "Section ID cannot be empty").optional(),
        isPreview: z.union([z.boolean(), z.string().transform(val => val === "true")]).optional(),
        order: z.coerce.number().min(0, "Order must be at least 0").optional(),
    })
});
