import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { subFieldFilterableFields } from "./subField.constant";
import { SubFieldService } from "./subField.service";

const createSubField = catchAsync(async (req: Request, res: Response) => {

    const result = await SubFieldService.createSubField(req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sub Field created successfully',
        data: result
    });


})

const getAllSubFields = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, subFieldFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await SubFieldService.getAllSubFields(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sub Field data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getSingleSubField = catchAsync(async (req: Request, res: Response) => {


    const result = await SubFieldService.getSingleSubField(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sub Field data fetched",
        data: result
    })
})

const updateSubFieldInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubFieldService.updateSubFieldInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SubField info updated successfully',
        data: result
    });
})

const assignJob = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubFieldService.assignJob(id, req.body.job)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign job data successfully",
        data: result
    })
})

const assignCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubFieldService.assignCourse(id, req.body.course)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign course data successfully",
        data: result
    })
})

const unassignJob = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubFieldService.unassignJob(id, req.body.job)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Unassign job data successfully",
        data: result
    })
})

const getAssignJob = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const filters = pick(req.query, subFieldFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await SubFieldService.getAssignJob(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get Assign job data successfully",
        meta: result.meta,
        data: result.data
    })
})

const getUnassignJob = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const filters = pick(req.query, subFieldFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await SubFieldService.getUnassignJob(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get unassign job data successfully",
        meta: result.meta,
        data: result.data
    })
})

const unassignCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubFieldService.unassignCourse(id, req.body.course)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Unassign course data successfully",
        data: result
    })
})

const getAssignCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const filters = pick(req.query, subFieldFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await SubFieldService.getAssignCourse(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get Assign course data successfully",
        meta: result.meta,
        data: result.data
    })
})

const getUnassignCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const filters = pick(req.query, subFieldFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await SubFieldService.getUnassignCourse(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get unassign course data successfully",
        meta: result.meta,
        data: result.data
    })
})


export const SubFieldController = {
    createSubField,
    getAllSubFields,
    getSingleSubField,
    updateSubFieldInfo,
    assignJob,
    assignCourse,
    unassignJob,
    getAssignJob,
    getUnassignJob,
    unassignCourse,
    getAssignCourse,
    getUnassignCourse
}