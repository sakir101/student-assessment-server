import { Faculty, FacultyEnrollment, Interest, InterestStudent, Prisma, Student } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { facultySearchableFields } from "../faculty/faculty.constant";
import { IFacultyFilterRequest } from "../faculty/faculty.interface";
import { interestSearchableFields } from "../interest/interest.constant";
import { IInterestFilterRequest } from "../interest/interest.interface";


const getStudentByUserId = async (id: string): Promise<Student | null> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }


    return studentInfo;
}

const assignInterest = async (
    id: string,
    payload: string[]
): Promise<InterestStudent[]> => {

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
            studentId: sId,
            interestId: {
                in: payload,
            },
        },
    });

    const existingInterestIds = existingInterests.map((interest) => interest.interestId);

    const newInterestsToCreate = payload.filter((interestId) => !existingInterestIds.includes(interestId));

    await prisma.interestStudent.createMany({
        data: newInterestsToCreate.map((interestId) => ({
            interestId,
            studentId: sId,
        })),
    });
    const assignInterestData = await prisma.interestStudent.findMany({
        where: {
            studentId: sId
        },
        include: {
            interest: true
        }
    })
    return assignInterestData
}

const deleteInterest = async (
    id: string,
    payload: string[]
): Promise<InterestStudent[] | ''> => {
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
            studentId: sId,
            interestId: {
                in: payload,
            },
        },
    });

    if (existingInterests) {
        await prisma.interestStudent.deleteMany({
            where: {
                studentId: sId,
                interestId: {
                    in: payload,
                },

            }
        });
        const assignInterestData = await prisma.interestStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })
        return assignInterestData
    }

    return ""


}

const getAssignInterest = async (
    id: string,
    filters: IInterestFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Interest[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters



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



    const interestIds: string[] = [];

    existingInterests.forEach(item => {
        interestIds.push(item.interestId);
    });

    const result = await prisma.interest.findMany({
        where: {
            AND: [
                { id: { in: interestIds } },
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

    const total = await prisma.interestStudent.count({
        where: {
            studentId: sId,
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

const enrollFaculties = async (
    id: string,
    payload: string[]
): Promise<FacultyEnrollment[]> => {

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }

    const { id: sId } = studentInfo
    const existingEnrolledFaculties = await prisma.facultyEnrollment.findMany({
        where: {
            studentId: sId,
            facultyId: {
                in: payload,
            },
        },
    });

    const existingEnrolledFacultyIds = existingEnrolledFaculties.map((faculty) => faculty.facultyId);

    const newEnrolledFaculties = payload.filter((facultyId) => !existingEnrolledFacultyIds.includes(facultyId));

    await prisma.facultyEnrollment.createMany({
        data: newEnrolledFaculties.map((facultyId) => ({
            facultyId,
            studentId: sId,
        })),
    });
    const enrolledFacultiesData = await prisma.facultyEnrollment.findMany({
        where: {
            studentId: sId
        },
        include: {
            faculty: true
        }
    })
    return enrolledFacultiesData
}

const unenrollFaculty = async (
    id: string,
    payload: string[]
): Promise<FacultyEnrollment[] | ''> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }

    const { id: sId } = studentInfo
    const existingEnrolledFaculties = await prisma.facultyEnrollment.findMany({
        where: {
            studentId: sId,
            facultyId: {
                in: payload,
            },
        },
    });

    if (existingEnrolledFaculties) {
        const res = await prisma.facultyEnrollment.deleteMany({
            where: {
                studentId: sId,
                facultyId: {
                    in: payload,
                },

            }
        });
        if (!res) {
            throw new ApiError(httpStatus.NOT_FOUND, "Faculty Unenrolled Failed")
        }
        const enrolledFacultiesData = await prisma.facultyEnrollment.findMany({
            where: {
                studentId: sId
            },
            include: {
                faculty: true
            }
        })
        return enrolledFacultiesData
    }

    return ""


}

const getEnrolledFaculties = async (
    id: string,
    filters: IFacultyFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters



    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }


    const { id: sId } = studentInfo
    const existingEnrolledFaculties = await prisma.facultyEnrollment.findMany({
        where: {
            studentId: sId
        },
        include: {
            faculty: true
        }
    })




    if (existingEnrolledFaculties.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student did not enroll under any faculty");
    }

    const andConditions = []
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

    const whereConditions: Prisma.FacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}



    const enrolledFacultyIds: string[] = [];

    existingEnrolledFaculties.forEach(item => {
        enrolledFacultyIds.push(item.facultyId);
    });

    const result = await prisma.faculty.findMany({
        where: {
            AND: [
                { id: { in: enrolledFacultyIds } },
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
            studentId: sId,
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


export const StudentService = {
    getStudentByUserId,
    assignInterest,
    deleteInterest,
    getAssignInterest,
    enrollFaculties,
    unenrollFaculty,
    getEnrolledFaculties
}
