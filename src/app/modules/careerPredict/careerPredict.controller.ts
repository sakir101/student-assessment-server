import { Request, Response } from 'express';
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CareerPredictService } from "./careerPredict.service";



const careerPrediction = catchAsync(async (req: Request, res: Response) => {


    const { id } = req.params

    const result = await CareerPredictService.careerPrediction(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Career Prediction successful',
        data: result
    });


})

export const CareerPredictController = {
    careerPrediction
}


