import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { subFieldFilterableFields } from "./subField.constant";
import { SubFieldService } from "./subField.service";

const createSubField = catchAsync(async (req: Request, res: Response) => {

    const result = await SubFieldService.createSubField(req.body)

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

export const SubFieldController = {
    createSubField,
    getAllSubFields,
    getSingleSubField,
    updateSubFieldInfo
}