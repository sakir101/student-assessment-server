import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { jobFilterableFields } from "./job.constant";
import { JobService } from "./job.service";

const createJob = catchAsync(async (req: Request, res: Response) => {

    const result = await JobService.createJob(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Job created successfully',
        data: result
    });


})

const getAllJobs = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, jobFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await JobService.getAllJobs(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getSingleJob = catchAsync(async (req: Request, res: Response) => {


    const result = await JobService.getSingleJob(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job data fetched",
        data: result
    })
})

const updateJobInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await JobService.updateJobInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Job info updated successfully',
        data: result
    });
})

const deleteJobInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await JobService.deleteJobInfo(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Job info deleted successfully',
        data: result
    });
})

const getAllSpecificJob = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, jobFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await JobService.getAllSpecificJob(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

export const JobController = {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJobInfo,
    deleteJobInfo,
    getAllSpecificJob
}