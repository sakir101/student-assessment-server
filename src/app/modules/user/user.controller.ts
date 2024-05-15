import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const createStudent = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createStudent(req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully',
        data: result
    });
})

const createFaculty = catchAsync(async (req: Request, res: Response) => {


    const result = await UserService.createFaculty(req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully',
        data: result
    });
})

const updateStudentInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.updateStudentInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student info updated successfully',
        data: result
    });
})

const updateFacultyInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.updateFacultyInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty info updated successfully',
        data: result
    });
})



export const UserController = {
    createStudent,
    createFaculty,
    updateStudentInfo,
    updateFacultyInfo
}