import { Faculty, InterestFaculty, Prisma, Student } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { studentSearchableFields } from "../student/student.constant";
import { IStudentFilterRequest } from "../student/student.interface";
import { facultySearchableFields } from "./faculty.constant";
import { IFacultyFilterRequest } from "./faculty.interface";

const assignInterestFaculty = async (
    id: string,
    payload: string[]
): Promise<InterestFaculty[]> => {

    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }

    const { id: fId } = facultyInfo
    const existingInterests = await prisma.interestFaculty.findMany({
        where: {
            facultyId: fId,
            interestId: {
                in: payload,
            },
        },
    });

    const existingInterestIds = existingInterests.map((interest) => interest.interestId);

    const newInterestsToCreate = payload.filter((interestId) => !existingInterestIds.includes(interestId));

    await prisma.interestFaculty.createMany({
        data: newInterestsToCreate.map((interestId) => ({
            interestId,
            facultyId: fId,
        })),
    });
    const assignInterestData = await prisma.interestFaculty.findMany({
        where: {
            facultyId: fId
        },
        include: {
            interest: true
        }
    })
    return assignInterestData
}

const getSpecificFaculties = async (
    filters: IFacultyFilterRequest,
    options: IPaginationOptions,
    id: string
): Promise<IGenericResponse<Faculty[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []

    if (searchTerm || Object.keys(filterData).length > 0) {
        const studentInfo = await prisma.student.findFirst({
            where: {
                userId: id
            }
        })

        if (!studentInfo) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
        }


        const { id: sId } = studentInfo
        const existingInterests = await prisma.interestStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })

        if (existingInterests.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student did not select any interest");
        }


        if (searchTerm) {
            andConditions.push({
                OR: facultySearchableFields.map((field) => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }))
            })
        }

        if (Object.keys(filterData).length > 0) {
            andConditions.push({
                AND: [
                    ...Object.entries(filterData)
                        .filter(([key]) => key !== 'InterestFaculty')
                        .map(([key, value]) => ({
                            [key]: value
                        })),
                    ...Object.entries(filterData)
                        .filter(([key]) => key === 'InterestFaculty')
                        .map(([key, value]) => {
                            if (!Array.isArray(value)) {
                                value = [value];
                            }
                            return {
                                [key]: {
                                    some: {
                                        interest: {
                                            title: {
                                                in: value
                                            }
                                        }
                                    }
                                }
                            };
                        })
                ]
            });
        }
    }

    else {
        const studentInfo = await prisma.student.findFirst({
            where: {
                userId: id
            }
        })

        if (!studentInfo) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
        }


        const { id: sId } = studentInfo
        const existingInterests = await prisma.interestStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })

        if (existingInterests.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student did not select any interest");
        }

        const interest = existingInterests.map(item => item.interest.title);


        // Add matching interest condition
        if (interest.length > 0) {
            andConditions.push({
                InterestFaculty: {
                    some: {
                        interest: {
                            title: {
                                in: interest
                            }
                        }
                    }
                }
            });
        }
    }




    const whereConditions: Prisma.FacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.faculty.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            firstName: 'asc'
        }
    });

    console.log(result)

    const total = await prisma.faculty.count({ where: whereConditions });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const getEnrolledStudents = async (
    id: string,
    filters: IStudentFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters



    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }


    const { id: fId } = facultyInfo
    const existingEnrolledStudents = await prisma.facultyEnrollment.findMany({
        where: {
            facultyId: fId
        },
        include: {
            student: true
        }
    })




    if (existingEnrolledStudents.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty has no enrolled students");
    }

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: studentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: [
                ...Object.entries(filterData)
                    .filter(([key]) => key !== 'interests')
                    .map(([key, value]) => ({
                        [key]: value
                    })),
                ...Object.entries(filterData)
                    .filter(([key]) => key === 'interests')
                    .map(([key, value]) => {
                        if (!Array.isArray(value)) {
                            value = [value];
                        }
                        return {
                            [key]: {
                                some: {
                                    interest: {
                                        title: {
                                            in: value
                                        }
                                    }
                                }
                            }
                        };
                    })
            ]
        });
    }

    const whereConditions: Prisma.StudentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}



    const enrolledStudentsIds: string[] = [];

    existingEnrolledStudents.forEach(item => {
        enrolledStudentsIds.push(item.studentId);
    });

    const result = await prisma.student.findMany({
        where: {
            AND: [
                { id: { in: enrolledStudentsIds } },
                whereConditions
            ]
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                firstName: 'asc'
            }
    });

    const total = await prisma.facultyEnrollment.count({
        where: {
            facultyId: fId,
        },
    });


    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
}

export const FacultyService = {
    assignInterestFaculty,
    getSpecificFaculties,
    getEnrolledStudents
}
