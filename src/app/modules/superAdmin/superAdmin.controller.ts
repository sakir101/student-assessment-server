import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import pick from "../../../shared/pick"
import sendResponse from "../../../shared/sendResponse"
import { userFilterableFields } from "./superAdmin.constant"
import { SuperAdminService } from "./superAdmin.service"

const getSuperAdminByUserId = catchAsync(async (req: Request, res: Response) => {


    const result = await SuperAdminService.getSuperAdminByUserId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Super Admin data fetched by user id",
        data: result
    })
})

const getSuperAdminBySuperAdminId = catchAsync(async (req: Request, res: Response) => {


    const result = await SuperAdminService.getSuperAdminBySuperAdminId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "SuperAdmin data fetched by user id",
        data: result
    })
})

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, userFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await SuperAdminService.getAllAdmins(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admins data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getAllFaculties = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, userFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await SuperAdminService.getAllFaculties(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculties data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getAllStudents = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, userFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await SuperAdminService.getAllStudents(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Students data are fetched",
        meta: result.meta,
        data: result.data
    })
})

export const SuperAdminController = {
    getSuperAdminByUserId,
    getSuperAdminBySuperAdminId,
    getAllAdmins,
    getAllFaculties,
    getAllStudents
}