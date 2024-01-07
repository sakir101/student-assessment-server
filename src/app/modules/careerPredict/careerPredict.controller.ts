import express, { Request, Response } from 'express';
import httpStatus from "http-status";
import path from 'path';
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CareerPredictService } from "./careerPredict.service";

const app = express();

const careerPrediction = catchAsync(async (req: Request, res: Response) => {

    app.use(express.static(path.join(__dirname, 'public')));
    const filePath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(filePath);

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


