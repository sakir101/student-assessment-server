import { Job, Prisma } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { jobSearchableFields } from "./job.constant";
import { IJobFilterRequest } from "./job.interface";

const createJob = async (JobData: Job): Promise<Job> => {
    const result = await prisma.job.create({
        data: JobData
    })
    return result
}

const getAllJobs = async (
    filters: IJobFilterRequest,
    options: IPaginationOptions
) => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters


    const existingCreatedJobs = await prisma.job.findMany();

    if (existingCreatedJobs.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Jobs  are created");
    }


    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: jobSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData)
                .filter(([key]) => key === 'updatedAt' || key === 'createdAt')
                .map(([key, value]) => {
                    if (value === "Recently") {
                        return {
                            [key]: {
                                gt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                            }
                        };
                    }

                    if (value === "2days") {
                        return {
                            [key]: {
                                gt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                            }
                        };
                    }

                    if (value === "1week") {
                        return {
                            [key]: {
                                gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                            }
                        };
                    }

                    if (value === "1month") {
                        return {
                            [key]: {
                                gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
                            }
                        };
                    }

                    return {};
                })
        });
    }

    const whereConditions: Prisma.JobWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};



    const jobIds: string[] = [];

    existingCreatedJobs.forEach(item => {
        jobIds.push(item.id);
    });
    let result = []
    let result1 = []
    let total = null
    if (searchTerm || Object.keys(filterData).length > 0) {
        result1 = await prisma.job.findMany({
            where: {
                AND: [
                    { id: { in: jobIds } },
                    whereConditions
                ]
            },
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder
                } : {
                    title: 'asc'
                }
        });
        result = await prisma.job.findMany({
            where: {
                AND: [
                    { id: { in: jobIds } },
                    whereConditions
                ]
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder
                } : {
                    title: 'asc'
                }
        });

        total = result1.length
    }

    else {
        result = await prisma.job.findMany({
            where: {
                AND: [
                    { id: { in: jobIds } },
                    whereConditions
                ]
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder
                } : {
                    title: 'asc'
                }
        });

        total = await prisma.job.count();
    }


    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
}

const getSingleJob = async (id: string): Promise<Job | null> => {
    const JobInfo = await prisma.job.findFirst({
        where: {
            id
        }
    })

    if (!JobInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Job not found")
    }


    return JobInfo;
}

const updateJobInfo = async (id: string, req: Request): Promise<Job> => {
    const JobInfo = await prisma.job.findFirst({
        where: {
            id
        },
    })

    if (!JobInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Job does not exist")
    }
    const { title, JobLink, desc, status, companyWebsite } = req.body
    const updatedJobData = {
        title,
        JobLink,
        desc,
        status,
        companyWebsite
    }
    const updatedJobResult = await prisma.job.update({
        where: { id },
        data: updatedJobData
    });

    return updatedJobResult
}

export const JobService = {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJobInfo
}
