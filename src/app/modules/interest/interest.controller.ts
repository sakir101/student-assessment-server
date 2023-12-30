import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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

export const InterestController = {
    createInterest
}