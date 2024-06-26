import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { courseFilterableFields } from "./course.constant";
import { CourseService } from "./course.service";

const createCourse = catchAsync(async (req: Request, res: Response) => {

    const result = await CourseService.createCourse(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course created successfully',
        data: result
    });


})

const getAllCourses = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, courseFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await CourseService.getAllCourses(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {


    const result = await CourseService.getSingleCourse(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course data fetched",
        data: result
    })
})

const updateCourseInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseService.updateCourseInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course info updated successfully',
        data: result
    });
})

const deleteCourseInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseService.deleteCourseInfo(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course info deleted successfully',
        data: result
    });
})

const getAllSpecificCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, courseFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await CourseService.getAllSpecificCourse(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})


export const CourseController = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourseInfo,
    deleteCourseInfo,
    getAllSpecificCourse
}
