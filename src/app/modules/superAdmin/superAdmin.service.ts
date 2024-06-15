import { Admin, Faculty, Prisma, Student, SuperAdmin } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { userSearchableFields } from "./superAdmin.constant";
import { ISuperAdminFilterRequest } from "./superAdmin.interface";

const getSuperAdminByUserId = async (id: string): Promise<SuperAdmin | null> => {
    const SuperAdminInfo = await prisma.superAdmin.findFirst({
        where: {
            userId: id
        },
        include: {
            user: true
        }
    })

    if (!SuperAdminInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Super Admin does not exist")
    }


    return SuperAdminInfo;
}

const getSuperAdminBySuperAdminId = async (id: string): Promise<SuperAdmin | null> => {
    const SuperAdminInfo = await prisma.superAdmin.findFirst({
        where: {
            id
        },
        include: {
            user: true
        }
    })

    if (!SuperAdminInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Super Admin does not exist")
    }


    return SuperAdminInfo;
}

const getAllAdmins = async (
    filters: ISuperAdminFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Admin[]>> => {
    const { page, limit } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.AdminWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.admin.findMany({
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                firstName: 'asc'
            }
    });

    const total = await prisma.admin.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}
const getAllFaculties = async (
    filters: ISuperAdminFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {

    const { page, limit } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.FacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.faculty.findMany({
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                firstName: 'asc'
            }
    });

    const total = await prisma.faculty.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}
const getAllStudents = async (
    filters: ISuperAdminFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {

    const { page, limit } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.StudentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.student.findMany({
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                firstName: 'asc'
            }
    });

    const total = await prisma.student.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

export const SuperAdminService = {
    getSuperAdminByUserId,
    getSuperAdminBySuperAdminId,
    getAllAdmins,
    getAllFaculties,
    getAllStudents
}