import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await TaskService.createTask(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Task created successfully',
        data: result
    });


})



export const TaskController = {
    createTask
}