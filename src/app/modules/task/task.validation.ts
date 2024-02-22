import { z } from "zod";

const create = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required'
        }),
        description: z.string({
            required_error: 'Description is required'
        }),
        solution: z.string().optional()
    })
});

const update = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        solution: z.string().optional()
    })
});

const assignTaskHint = z.object({
    body: z.object({
        description: z.string({
            required_error: 'Description is required'
        })
    })
});

export const TaskValidation = {
    create,
    update,
    assignTaskHint
};