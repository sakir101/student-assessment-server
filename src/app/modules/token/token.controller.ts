import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { TokenService } from "./token.service"

const verifyEmail = catchAsync(async (req: Request, res: Response) => {


    await TokenService.verifyEmail(req.params.userId, req.params.token)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Email verification successful!",

    })
})

export const TokenController = {
    verifyEmail
}