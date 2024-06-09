import { z } from "zod";
import { status } from "./course.constant";

const createCourseZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required"
        }),
        courseLink: z.string({
            required_error: "Course link is required"
        }),
        desc: z.string({
            required_error: "Description is required"
        }),
        status: z.enum([...status] as [string, ...string[]], {
            required_error: 'Status is required'
        }),
        price: z.string({
            required_error: "Price is required"
        }),
    })

})

const updateCourseZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        courseLink: z.string().optional(),
        desc: z.string().optional(),
        status: z.enum([...status] as [string, ...string[]],).optional(),
        price: z.string().optional(),
    })

})

export const CourseValidation = {
    createCourseZodSchema,
    updateCourseZodSchema
}