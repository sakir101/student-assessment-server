import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ILoginUserResponse } from "./auth.interface";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;


    const result = await AuthService.loginUser(loginData)
    const { refreshToken, ...others } = result;

    // set refresh token into cookie

    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true
    }

    res.cookie('refreshToken', refreshToken, cookieOptions)

    delete result.refreshToken

    sendResponse<ILoginUserResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User login successfully',
        data: others,
    })
})

const renewPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    console.log(email)

    await AuthService.renewPassword(email)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Email send successfully',
    })
})

export const AuthController = {
    loginUser,
    renewPassword
}