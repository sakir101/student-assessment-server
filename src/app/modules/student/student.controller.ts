import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StudentService } from "./student.service";

const assignInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await StudentService.assignInterest(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign interest data successfully",
        data: result
    })
})

export const StudentController = {
    assignInterest
}