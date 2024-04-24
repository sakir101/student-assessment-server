import { z } from "zod";

const relatedWorksCreateZodSchema = z.object({
    body: z.object({
        description: z.string({
            required_error: "Description is required"
        }),
    })
})

const relatedWorksUpdateZodSchema = z.object({
    body: z.object({
        description: z.string().optional(),
    })
})

export const RelatedWorksValidation = {
    relatedWorksCreateZodSchema,
    relatedWorksUpdateZodSchema
}