import { Interest, Prisma } from "@prisma/client"
import httpStatus from "http-status"
import ApiError from "../../../errors/ApiError"
import { paginationHelpers } from "../../../helpers/paginationHelper"
import { IGenericResponse } from "../../../interfaces/common"
import { IPaginationOptions } from "../../../interfaces/pagination"
import prisma from "../../../shared/prisma"
import { interestSearchableFields } from "./interest.constant"
import { IInterestFilterRequest } from "./interest.interface"

const createInterest = async (interestData: Interest): Promise<Interest> => {
    const result = await prisma.interest.create({
        data: interestData
    })
    return result
}

const getAllInterest = async (
    filters: IInterestFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Interest[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: interestSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.InterestWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.interest.findMany({
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                title: 'asc'
            }
    });

    const total = await prisma.interest.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const getSingleInterest = async (id: string): Promise<Interest | null> => {
    const interestInfo = await prisma.interest.findFirst({
        where: {
            id
        }
    })

    if (!interestInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Interest not found")
    }


    return interestInfo;
}



export const InterestService = {
    createInterest,
    getAllInterest,
    getSingleInterest
}