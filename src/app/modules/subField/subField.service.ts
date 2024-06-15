import { CourseSubField, JobSubField, Prisma, SubField } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { ICloudinaryResponse, IUploadFile } from "../../../interfaces/file";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { subFieldSearchableFields } from "./subField.constant";
import { ISubFieldFilterRequest } from "./subField.interface";

const createSubField = async (req: Request) => {
    const file = req.file as IUploadFile;
    const { subField: subFieldData } = req.body
    if (subFieldData) {
        if (file === undefined) {
            subFieldData.img = 'https://res.cloudinary.com/dporza1qj/image/upload/v1718364467/consultingIT_nqvwkb.jpg'

        }

        else {
            const uploadImage: ICloudinaryResponse = await FileUploadHelper.uploadToCloudinary(file)

            if (uploadImage) {
                subFieldData.img = uploadImage.secure_url
            }
        }

        const result = await prisma.subField.create({
            data: subFieldData
        })

        return result
    }


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

const updateSubFieldInfo = async (id: string, req: Request) => {
    const SubFieldInfo = await prisma.subField.findFirst({
        where: {
            id
        },
    })

    if (!SubFieldInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Sub Field does not exist")
    }

    const file = req.file as IUploadFile;
    const { subField: subFieldData } = req.body

    if (subFieldData) {

        if (file !== undefined) {
            const uploadImage: ICloudinaryResponse = await FileUploadHelper.uploadToCloudinary(file)

            if (uploadImage) {
                subFieldData.img = uploadImage.secure_url
            }

            else {
                throw new ApiError(httpStatus.NOT_FOUND, "Image upload failed")
            }
        }

        if (file === undefined) {
            subFieldData.img = SubFieldInfo.img
        }

        const { title, desc, img } = subFieldData
        const updatedSubFieldData = {
            title,
            desc,
            img
        }

        const updatedSubFieldResult = await prisma.subField.update({
            where: { id },
            data: updatedSubFieldData
        });

        return updatedSubFieldResult
    }

}

const assignJob = async (
    id: string,
    payload: string[]
): Promise<JobSubField[]> => {

    const subField = await prisma.subField.findFirst({
        where: {
            id
        }
    })

    if (!subField) {
        throw new ApiError(httpStatus.NOT_FOUND, "Sub field does not exist")
    }

    const { id: sId } = subField
    const existingJobField = await prisma.jobSubField.findMany({
        where: {
            subFieldId: sId,
            jobId: {
                in: payload,
            },
        },
    });

    const existingJobFieldIds = existingJobField.map((subField) => subField.subFieldId);

    const newSubFieldsToCreate = payload.filter((subFieldId) => !existingJobFieldIds.includes(subFieldId));

    await prisma.jobSubField.createMany({
        data: newSubFieldsToCreate.map((jobId) => ({
            jobId,
            subFieldId: sId,
        })),
    });
    const assignJobData = await prisma.jobSubField.findMany({
        where: {
            subFieldId: sId
        },
        include: {
            job: true
        }
    })
    return assignJobData
}

const assignCourse = async (
    id: string,
    payload: string[]
): Promise<CourseSubField[]> => {

    const subField = await prisma.subField.findFirst({
        where: {
            id
        }
    })

    if (!subField) {
        throw new ApiError(httpStatus.NOT_FOUND, "Sub field does not exist")
    }

    const { id: sId } = subField
    const existingCourseField = await prisma.courseSubField.findMany({
        where: {
            subFieldId: sId,
            courseId: {
                in: payload,
            },
        },
    });

    const existingCourseFieldIds = existingCourseField.map((subField) => subField.subFieldId);

    const newSubFieldsToCreate = payload.filter((subFieldId) => !existingCourseFieldIds.includes(subFieldId));

    await prisma.courseSubField.createMany({
        data: newSubFieldsToCreate.map((courseId) => ({
            courseId,
            subFieldId: sId,
        })),
    });
    const assignCourseData = await prisma.courseSubField.findMany({
        where: {
            subFieldId: sId
        },
        include: {
            course: true
        }
    })
    return assignCourseData
}

export const SubFieldService = {
    createSubField,
    getAllSubFields,
    getSingleSubField,
    updateSubFieldInfo,
    assignJob,
    assignCourse
}
