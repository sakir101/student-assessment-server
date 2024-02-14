import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { facultyFilterableFields } from "../faculty/faculty.constant";
import { interestFilterableFields } from "../interest/interest.constant";
import { StudentService } from "./student.service";

const getStudentByUserId = catchAsync(async (req: Request, res: Response) => {


    const result = await StudentService.getStudentByUserId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student data fetched by user id",
        data: result
    })
})

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

const deleteInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await StudentService.deleteInterest(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete interest data successfully",
        data: result
    })
})

const getAssignInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, interestFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getAssignInterest(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign interest data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const enrollFaculties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentService.enrollFaculties(id, req.body.faculty)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty enrolled successfully",
        data: result
    })
})

const unenrollFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await StudentService.unenrollFaculty(id, req.body.faculty)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty unenrolled successfully",
        data: result
    })
})

const getEnrolledFaculties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, facultyFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getEnrolledFaculties(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Enrolled faculties retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

export const StudentController = {
    getStudentByUserId,
    assignInterest,
    deleteInterest,
    getAssignInterest,
    enrollFaculties,
    unenrollFaculty,
    getEnrolledFaculties
}