import { z } from "zod";

const createSubFieldZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required"
        }),
        desc: z.string({
            required_error: "Description is required"
        }),
    })

})

const updateSubFieldZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        desc: z.string().optional(),
    })

})

export const SubFieldValidation = {
    createSubFieldZodSchema,
    updateSubFieldZodSchema
}