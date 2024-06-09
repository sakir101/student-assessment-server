import { z } from "zod";
import { status } from "./job.constant";


const createJobZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required"
        }),
        jobLink: z.string({
            required_error: "Job link is required"
        }),
        desc: z.string({
            required_error: "Description is required"
        }),
        status: z.enum([...status] as [string, ...string[]], {
            required_error: 'Status is required'
        }),
        companyWebsite: z.string({
            required_error: "Company website is required"
        }),

    })

})

const updateJobZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        jobLink: z.string().optional(),
        desc: z.string().optional(),
        status: z.enum([...status] as [string, ...string[]],).optional(),
        companyWebsite: z.string().optional(),
    })

})

export const JobValidation = {
    createJobZodSchema,
    updateJobZodSchema
}