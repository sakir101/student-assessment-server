import { z } from "zod";
import { skillStatus } from "./skill.constant";

const skillUpdateZodSchema = z.object({
    body: z.object({
        status: z.enum([...skillStatus] as [string, ...string[]], {
            required_error: 'Skill status is required'
        })
    })
})

export const SkillValidation = {
    skillUpdateZodSchema
}