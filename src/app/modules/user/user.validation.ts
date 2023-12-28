import { z } from "zod";
import { gender, institution } from "../student/student.constant";

const createStudentZodSchema = z.object({
    body: z.object({
        password: z.string({
            required_error: "Password is required"
        }),
        email: z.string({
            required_error: "Email is required"
        }),
        student: z.object({
            firstName: z.string({
                required_error: "First name is required"
            }),
            lastName: z.string({
                required_error: "Last name is required"
            }),
            middleName: z.string({
                required_error: "Middle name is required"
            }),
            profileImage: z.string().optional(),
            gender: z.enum([...gender] as [string, ...string[]], {
                required_error: 'Gender is required'
            }),
            institution: z.enum([...institution] as [string, ...string[]], {
                required_error: 'Institution is required'
            }),

        })
    })
})

export const UserValidation = {
    createStudentZodSchema
}