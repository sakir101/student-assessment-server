import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { AdminService } from "./admin.service"

const getAdminByUserId = catchAsync(async (req: Request, res: Response) => {


    const result = await AdminService.getAdminByUserId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched by user id",
        data: result
    })
})

const getAdminByAdminId = catchAsync(async (req: Request, res: Response) => {


    const result = await AdminService.getAdminByAdminId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched by user id",
        data: result
    })
})

export const AdminController = {

    getAdminByUserId,
    getAdminByAdminId
}
