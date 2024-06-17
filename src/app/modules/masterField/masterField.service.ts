import { MasterField, MasterFieldSubField, Prisma, SubField } from "@prisma/client"
import { Request } from "express"
import httpStatus from "http-status"
import ApiError from "../../../errors/ApiError"
import { paginationHelpers } from "../../../helpers/paginationHelper"
import { IGenericResponse } from "../../../interfaces/common"
import { IPaginationOptions } from "../../../interfaces/pagination"
import prisma from "../../../shared/prisma"
import { subFieldSearchableFields } from "../subField/subField.constant"
import { ISubFieldFilterRequest } from "../subField/subField.interface"
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

const assignSubField = async (
    id: string,
    payload: string[]
): Promise<MasterFieldSubField[]> => {

    const masterField = await prisma.masterField.findFirst({
        where: {
            id
        }
    })

    if (!masterField) {
        throw new ApiError(httpStatus.NOT_FOUND, "Master field does not exist")
    }

    const { id: mId } = masterField
    const existingSubField = await prisma.masterFieldSubField.findMany({
        where: {
            masterFieldId: mId,
            subFieldId: {
                in: payload,
            },
        },
    });

    const existingSubFieldIds = existingSubField.map((subField) => subField.subFieldId);

    const newSubFieldsToCreate = payload.filter((subFieldId) => !existingSubFieldIds.includes(subFieldId));

    await prisma.masterFieldSubField.createMany({
        data: newSubFieldsToCreate.map((subFieldId) => ({
            subFieldId,
            masterFieldId: mId,
        })),
    });
    const assignSubFieldData = await prisma.masterFieldSubField.findMany({
        where: {
            masterFieldId: mId
        },
        include: {
            subField: true
        }
    })
    return assignSubFieldData
}

const getAssignSubField = async (
    id: string,
    filters: ISubFieldFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<SubField[]>> => {
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const masterFieldSubFields = await prisma.masterFieldSubField.findMany({
        where: {
            masterFieldId: id,
        },
        include: {
            subField: true,
        },
    });

    const subFieldIds = masterFieldSubFields.map(mfsf => mfsf.subFieldId);

    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: subFieldSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
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
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.subField.findMany({
        where: {
            AND: [
                { id: { in: subFieldIds } },
                whereConditions
            ]
        },
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                id: 'asc',
            },
    });

    const total = await prisma.subField.count({
        where: {
            id: { in: subFieldIds },
            ...whereConditions,
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getUnassignSubField = async (
    id: string,
    filters: ISubFieldFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<SubField[]>> => {
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;


    const assignedSubFields = await prisma.masterFieldSubField.findMany({
        where: {
            masterFieldId: id,
        },
        select: {
            subFieldId: true,
        },
    });

    const assignedSubFieldIds = assignedSubFields.map((mfsf) => mfsf.subFieldId);

    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: subFieldSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.SubFieldWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.subField.findMany({
        where: {
            id: { notIn: assignedSubFieldIds },
            ...whereConditions,
        },
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                id: 'asc',
            },
    });

    const total = await prisma.subField.count({
        where: {
            AND: [
                { id: { notIn: assignedSubFieldIds } },
                whereConditions
            ]
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const unassignSubField = async (
    id: string,
    payload: string[]
): Promise<MasterFieldSubField[]> => {
    const masterField = await prisma.masterField.findFirst({
        where: {
            id
        }
    });

    if (!masterField) {
        throw new ApiError(httpStatus.NOT_FOUND, "Master field does not exist");
    }

    const { id: mId } = masterField;

    const existingSubFields = await prisma.masterFieldSubField.findMany({
        where: {
            masterFieldId: mId,
            subFieldId: {
                in: payload,
            },
        },
    });

    if (existingSubFields.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No subfields found to unassign");
    }

    const subFieldIdsToUnassign = existingSubFields.map(subField => subField.subFieldId);

    await prisma.masterFieldSubField.deleteMany({
        where: {
            masterFieldId: mId,
            subFieldId: {
                in: subFieldIdsToUnassign,
            },
        },
    });

    const remainingSubFields = await prisma.masterFieldSubField.findMany({
        where: {
            masterFieldId: mId,
        },
        include: {
            subField: true,
        },
    });

    return remainingSubFields;
};


export const MasterFieldService = {
    createMasterField,
    getAllMasterFields,
    getSingleMasterField,
    updateMasterFieldInfo,
    assignSubField,
    getAssignSubField,
    getUnassignSubField,
    unassignSubField
}