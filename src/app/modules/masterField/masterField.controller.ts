import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { masterFieldFilterableFields } from "./masterField.constant";
import { MasterFieldService } from "./masterField.service";

const createMasterField = catchAsync(async (req: Request, res: Response) => {

    const result = await MasterFieldService.createMasterField(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'MasterField created successfully',
        data: result
    });


})

const getAllMasterFields = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, masterFieldFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await MasterFieldService.getAllMasterFields(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "MasterField data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getSingleMasterField = catchAsync(async (req: Request, res: Response) => {


    const result = await MasterFieldService.getSingleMasterField(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "MasterField data fetched",
        data: result
    })
})

const updateMasterFieldInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MasterFieldService.updateMasterFieldInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'MasterField info updated successfully',
        data: result
    });
})

export const MasterFieldController = {
    createMasterField,
    getAllMasterFields,
    getSingleMasterField,
    updateMasterFieldInfo
}