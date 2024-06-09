import { Prisma, SubField } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { subFieldSearchableFields } from "./subField.constant";
import { ISubFieldFilterRequest } from "./subField.interface";

const createSubField = async (SubFieldData: SubField): Promise<SubField> => {
    const result = await prisma.subField.create({
        data: SubFieldData
    })
    return result
}

const getAllSubFields = async (
    filters: ISubFieldFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<SubField[]>> => {

    const { page, limit } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: subFieldSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.SubFieldWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.subField.findMany({
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                title: 'asc'
            }
    });

    const total = await prisma.subField.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const getSingleSubField = async (id: string): Promise<SubField | null> => {
    const SubFieldInfo = await prisma.subField.findFirst({
        where: {
            id
        }
    })

    if (!SubFieldInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Sub Field not found")
    }


    return SubFieldInfo;
}

const updateSubFieldInfo = async (id: string, req: Request): Promise<SubField> => {
    const SubFieldInfo = await prisma.subField.findFirst({
        where: {
            id
        },
    })

    if (!SubFieldInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Sub Field does not exist")
    }
    const { title, desc } = req.body
    const updatedSubFieldData = {
        title,
        desc
    }
    const updatedSubFieldResult = await prisma.subField.update({
        where: { id },
        data: updatedSubFieldData
    });

    return updatedSubFieldResult
}

export const SubFieldService = {
    createSubField,
    getAllSubFields,
    getSingleSubField,
    updateSubFieldInfo
}
