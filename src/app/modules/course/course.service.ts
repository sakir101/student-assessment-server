import { Course, Prisma } from "@prisma/client"
import { Request } from "express"
import httpStatus from "http-status"
import ApiError from "../../../errors/ApiError"
import { paginationHelpers } from "../../../helpers/paginationHelper"
import { IPaginationOptions } from "../../../interfaces/pagination"
import prisma from "../../../shared/prisma"
import { courseSearchableFields } from "./course.constant"
import { ICourseFilterRequest } from "./course.interface"

const createCourse = async (CourseData: Course): Promise<Course> => {
    const result = await prisma.course.create({
        data: CourseData
    })
    return result
}

const getAllCourses = async (
    filters: ICourseFilterRequest,
    options: IPaginationOptions
) => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters


    const existingCreatedCourses = await prisma.course.findMany();

    if (existingCreatedCourses.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No courses  are created");
    }


    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: courseSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.CourseWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};



    const courseIds: string[] = [];

    existingCreatedCourses.forEach(item => {
        courseIds.push(item.id);
    });
    let result = []
    let result1 = []
    let total = null
    if (searchTerm || Object.keys(filterData).length > 0) {
        result1 = await prisma.course.findMany({
            where: {
                AND: [
                    { id: { in: courseIds } },
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
        result = await prisma.course.findMany({
            where: {
                AND: [
                    { id: { in: courseIds } },
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
        result = await prisma.course.findMany({
            where: {
                AND: [
                    { id: { in: courseIds } },
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

        total = await prisma.course.count();
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

const getSingleCourse = async (id: string): Promise<Course | null> => {
    const CourseInfo = await prisma.course.findFirst({
        where: {
            id
        }
    })

    if (!CourseInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found")
    }


    return CourseInfo;
}

const updateCourseInfo = async (id: string, req: Request): Promise<Course> => {
    const CourseInfo = await prisma.course.findFirst({
        where: {
            id
        },
    })

    if (!CourseInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course does not exist")
    }
    const { title, courseLink, desc, price, status } = req.body
    const updatedCourseData = {
        title,
        courseLink,
        desc,
        price,
        status
    }
    const updatedCourseResult = await prisma.course.update({
        where: { id },
        data: updatedCourseData
    });

    return updatedCourseResult
}

const deleteCourseInfo = async (id: string): Promise<Course | ''> => {
    const CourseInfo = await prisma.course.findFirst({
        where: {
            id
        },
    })

    if (!CourseInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course does not exist")
    }

    const deleteCourseResult = await prisma.course.delete({
        where: { id }
    });

    if (!deleteCourseResult) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete")
    }


    return ""

}

export const CourseService = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourseInfo,
    deleteCourseInfo
}
