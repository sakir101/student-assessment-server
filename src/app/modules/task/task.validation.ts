import { z } from "zod";
import { status } from "./task.constant";

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

const assignTaskFeedback = z.object({
    body: z.object({
        comment: z.string().optional(),
        status: z.enum([...status] as [string, ...string[]], {
            required_error: 'Status is required'
        }),

    })
})

const updateTaskFeedback = z.object({
    body: z.object({
        comment: z.string().optional(),
        status: z.enum([...status] as [string, ...string[]]).optional()
    })
})

export const TaskValidation = {
    create,
    update,
    assignTaskHint,
    assignTaskFeedback,
    updateTaskFeedback
};