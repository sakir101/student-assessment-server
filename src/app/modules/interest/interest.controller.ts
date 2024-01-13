import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { interestFilterableFields } from "./interest.constant";
import { InterestService } from "./interest.service";

const createInterest = catchAsync(async (req: Request, res: Response) => {

    const result = await InterestService.createInterest(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Interest created successfully',
        data: result
    });


})

const getAllInterest = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, interestFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await InterestService.getAllInterest(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Interest data are fetched",
        meta: result.meta,
        data: result.data
    })
})

export const InterestController = {
    createInterest,
    getAllInterest
}