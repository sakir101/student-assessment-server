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
        });

        if (!facultyInfo) {
            throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist");
        }

        const { id: fId } = facultyInfo;


        const { facultyId, ...taskWithoutFacultyId } = taskData;

        const result = await transactionClient.task.create({
            data: {
                ...taskWithoutFacultyId,
                faculty: { connect: { id: fId } }
            }
        });

        await transactionClient.taskFaculty.create({
            data: {
                taskId: result.id,
                facultyId: fId
            }
        });

        const createdTask = await transactionClient.task.findMany({
            where: {
                id: result.id
            },
            include: {
                faculty: true,
                hint: true,
                students: true
            }
        });

        return createdTask;
    });

    return newTask;
};




export const TaskService = {
    createTask
}
