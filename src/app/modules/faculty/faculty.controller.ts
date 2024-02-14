import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { studentFilterableFields } from "../student/student.constant";
import { facultyFilterableFields } from "./faculty.constant";
import { FacultyService } from "./faculty.service";

const assignInterestFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FacultyService.assignInterestFaculty(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign interest data successfully",
        data: result
    })
})

const getSpecificFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, facultyFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getSpecificFaculties(filters, options, id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specific Faculty Found Successfully",
        meta: result.meta,
        data: result.data
    })
})

const getEnrolledStudents = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, studentFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getEnrolledStudents(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Enrolled students retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

export const FacultyController = {
    assignInterestFaculty,
    getSpecificFaculty,
    getEnrolledStudents
}