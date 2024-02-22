import { Task } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

const createTask = async (id: string, taskData: Task) => {
    const newTask = await prisma.$transaction(async (transactionClient) => {
        const facultyInfo = await prisma.faculty.findFirst({
            where: {
                userId: id
            }
        })

        if (!facultyInfo) {
            throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
        }

        const result = await transactionClient.task.create({
            data: taskData
        });

        const { id: fId } = facultyInfo;

        await transactionClient.taskFaculty.createMany({
            data: [{
                taskId: result.id,
                facultyId: fId
            }]
        });

        const createdTask = await transactionClient.taskFaculty.findMany({
            where: {
                facultyId: fId
            },
            include: {
                task: true
            }
        })
        return createdTask
    });

    return newTask
};



export const TaskService = {
    createTask
}
