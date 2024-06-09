import { MasterField, Prisma } from "@prisma/client"
import { Request } from "express"
import httpStatus from "http-status"
import ApiError from "../../../errors/ApiError"
import { paginationHelpers } from "../../../helpers/paginationHelper"
import { IGenericResponse } from "../../../interfaces/common"
import { IPaginationOptions } from "../../../interfaces/pagination"
import prisma from "../../../shared/prisma"
import { masterFieldSearchableFields } from "./masterField.constant"
import { IMasterFieldFilterRequest } from "./masterField.interface"

const createMasterField = async (masterFieldData: MasterField): Promise<MasterField> => {
    const result = await prisma.masterField.create({
        data: masterFieldData
    })
    return result
}

const getAllMasterFields = async (
    filters: IMasterFieldFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<MasterField[]>> => {

    const { page, limit } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: masterFieldSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.MasterFieldWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.masterField.findMany({
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                title: 'asc'
            }
    });

    const total = await prisma.masterField.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const getSingleMasterField = async (id: string): Promise<MasterField | null> => {
    const masterFieldInfo = await prisma.masterField.findFirst({
        where: {
            id
        }
    })

    if (!masterFieldInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "MasterField not found")
    }


    return masterFieldInfo;
}

const updateMasterFieldInfo = async (id: string, req: Request): Promise<MasterField> => {
    const masterFieldInfo = await prisma.masterField.findFirst({
        where: {
            id
        },
    })

    if (!masterFieldInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Master Field does not exist")
    }
    const { title } = req.body
    const updatedMasterFieldResult = await prisma.masterField.update({
        where: { id },
        data: { title }
    });

    return updatedMasterFieldResult
}


export const MasterFieldService = {
    createMasterField,
    getAllMasterFields,
    getSingleMasterField,
    updateMasterFieldInfo
}