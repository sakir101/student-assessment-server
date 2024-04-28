import { Faculty, FacultyEnrollment, Interest, InterestStudent, Prisma, RelatedWorksStudent, SkillStudent, Student, TaskStudent } from "@prisma/client";
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
import { taskSearchableFields } from "../task/task.constant";
import { ITakFilterRequest } from "../task/task.interface";



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

const getStudentByStudentId = async (id: string): Promise<Student | null> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            id
        },
        include: {
            user: true
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

    let result = []
    let result1 = []
    let total = null

    if (searchTerm) {

        result1 = await prisma.interest.findMany({
            where: {
                AND: [
                    { id: { in: interestIds } },
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

        result = await prisma.interest.findMany({
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

        total = result1.length
    }

    else {
        result = await prisma.interest.findMany({
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

        total = await prisma.interestStudent.count({
            where: {
                studentId: sId,
            },
        });
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

const assignSkill = async (
    id: string,
    payload: string[]
): Promise<SkillStudent[]> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

    const { id: sId } = studentInfo;
    const existingSkills = await prisma.skillStudent.findMany({
        where: {
            studentId: sId,
            interestId: {
                in: payload,
            },
        },
    });

    const existingSkillIds = existingSkills.map((skill) => skill.interestId);
    const newSkillsToCreate = payload.filter((skillId) => !existingSkillIds.includes(skillId));

    await prisma.skillStudent.createMany({
        data: newSkillsToCreate.map((skillId) => ({
            interestId: skillId,
            studentId: sId,
            status: "NotSet"
        })),
    });

    const assignSkillData = await prisma.skillStudent.findMany({
        where: {
            studentId: sId
        },
        include: {
            interest: true
        }
    });

    return assignSkillData;
};

const updateSkillStatus = async (
    id: string,
    interestId: string,
    payload: Partial<SkillStudent>
) => {

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

    const { id: sId } = studentInfo;

    const existingSkill = await prisma.skillStudent.findFirst({
        where: {
            studentId: sId,
            interestId: interestId
        }
    });

    if (!existingSkill) {
        throw new ApiError(httpStatus.NOT_FOUND, "Skill not found for this student");
    }

    const updatedSkill = await prisma.skillStudent.update({
        where: {
            interestId_studentId: {
                studentId: sId,
                interestId: existingSkill.interestId
            }
        },
        data: {
            status: payload.status
        }
    });


    if (!updatedSkill) {
        throw new ApiError(httpStatus.NOT_FOUND, "Skill status update failed");
    }

    return updatedSkill;
};

const deleteSkill = async (
    id: string,
    payload: string[]
): Promise<SkillStudent[] | ''> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }

    const { id: sId } = studentInfo
    const existingSkill = await prisma.skillStudent.findMany({
        where: {
            studentId: sId,
            interestId: {
                in: payload,
            },
        },
    });

    if (existingSkill) {
        await prisma.skillStudent.deleteMany({
            where: {
                studentId: sId,
                interestId: {
                    in: payload,
                },

            }
        });
        const assignSkillData = await prisma.skillStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })
        return assignSkillData
    }

    return ""


}

const getAssignSkill = async (
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
    const existingSkills = await prisma.skillStudent.findMany({
        where: {
            studentId: sId
        },
        include: {
            interest: true
        }
    })




    if (existingSkills.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student did not select any skill");
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

    existingSkills.forEach(item => {
        interestIds.push(item.interestId);
    });

    let result = []
    let result1 = []
    let total = null

    if (searchTerm) {

        result1 = await prisma.interest.findMany({
            where: {
                AND: [
                    { id: { in: interestIds } },
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

        result = await prisma.interest.findMany({
            where: {
                AND: [
                    { id: { in: interestIds } },
                    whereConditions
                ]
            },
            skip,
            take: limit,
            include: {
                SkillStudent: true
            },
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
        result = await prisma.interest.findMany({
            where: {
                AND: [
                    { id: { in: interestIds } },
                    whereConditions
                ]
            },
            skip,
            take: limit,
            include: {
                SkillStudent: true
            },
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder
                } : {
                    title: 'asc'
                }
        });

        total = await prisma.skillStudent.count({
            where: {
                studentId: sId,
            },
        });
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

const getSingleSkill = async (
    id: string,
    interestId: string
): Promise<SkillStudent> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }

    const { id: sId } = studentInfo
    const singleSkill = await prisma.skillStudent.findFirst({
        where: {
            studentId: sId,
            interestId: interestId
        },
        include: {
            interest: true
        }
    });

    if (!singleSkill) {
        throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
    }

    return singleSkill
}

const assignRelatedWork = async (
    id: string,
    interestId: string,
    payload: Partial<RelatedWorksStudent>
): Promise<RelatedWorksStudent> => {

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

    const { id: sId } = studentInfo;

    const existingRelatedWork = await prisma.relatedWorksStudent.findFirst({
        where: {
            studentId: sId,
            interestId: interestId
        }
    });

    if (existingRelatedWork) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Related work already exists for this student");
    }

    const createdRelatedWork = await prisma.relatedWorksStudent.create({
        data: {
            interestId: interestId,
            studentId: sId,
            description: payload.description as string
        }
    });

    return createdRelatedWork;
};

const updateRelatedWorks = async (
    id: string,
    interestId: string,
    payload: Partial<RelatedWorksStudent>
) => {

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

    const { id: sId } = studentInfo;

    const existingRelatedWorks = await prisma.relatedWorksStudent.findFirst({
        where: {
            studentId: sId,
            interestId: interestId
        }
    });

    if (!existingRelatedWorks) {
        throw new ApiError(httpStatus.NOT_FOUND, "Related works not found for this student");
    }

    const updatedRelatedWorks = await prisma.relatedWorksStudent.update({
        where: {
            interestId_studentId: {
                studentId: sId,
                interestId: existingRelatedWorks.interestId
            }
        },
        data: {
            description: payload.description
        }
    });


    if (!updatedRelatedWorks) {
        throw new ApiError(httpStatus.NOT_FOUND, "Related works update failed");
    }

    return updatedRelatedWorks;
};

const deleteRelatedWorks = async (
    id: string,
    interestId: string
): Promise<RelatedWorksStudent[] | ''> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }

    const { id: sId } = studentInfo
    const existingRelatedWorks = await prisma.relatedWorksStudent.findFirst({
        where: {
            studentId: sId,
            interestId: interestId
        }
    });

    if (existingRelatedWorks) {
        await prisma.relatedWorksStudent.delete({
            where: {
                interestId_studentId: {
                    interestId: interestId,
                    studentId: sId
                }
            }
        });
        const assignRelatedWorksData = await prisma.relatedWorksStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })
        return assignRelatedWorksData
    }

    return ""
}

const getAssignRelatedWorks = async (
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
    const existingRelatedWorks = await prisma.relatedWorksStudent.findMany({
        where: {
            studentId: sId
        },
        include: {
            interest: true
        }
    })




    if (existingRelatedWorks.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student did not create any related works");
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

    existingRelatedWorks.forEach(item => {
        interestIds.push(item.interestId);
    });

    let result = []
    let result1 = []
    let total = null

    if (searchTerm) {

        result1 = await prisma.interest.findMany({
            where: {
                AND: [
                    { id: { in: interestIds } },
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

        result = await prisma.interest.findMany({
            where: {
                AND: [
                    { id: { in: interestIds } },
                    whereConditions
                ]
            },
            skip,
            take: limit,
            include: {
                RelatedWorksStudent: true
            },
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
        result = await prisma.interest.findMany({
            where: {
                AND: [
                    { id: { in: interestIds } },
                    whereConditions
                ]
            },
            skip,
            take: limit,
            include: {
                RelatedWorksStudent: true
            },
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder
                } : {
                    title: 'asc'
                }
        });

        total = await prisma.relatedWorksStudent.count({
            where: {
                studentId: sId,
            },
        });
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

const getSingleRelatedWork = async (
    id: string,
    interestId: string
): Promise<RelatedWorksStudent> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
    }

    const { id: sId } = studentInfo
    const singleRelatedWork = await prisma.relatedWorksStudent.findFirst({
        where: {
            studentId: sId,
            interestId: interestId
        },
        include: {
            interest: true
        }
    });

    if (!singleRelatedWork) {
        throw new ApiError(httpStatus.NOT_FOUND, "Related work not found");
    }

    return singleRelatedWork
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

    let result = []
    let result1 = []
    let total = null

    if (searchTerm || Object.keys(filterData).length > 0) {
        result1 = await prisma.faculty.findMany({
            where: {
                AND: [
                    { id: { in: enrolledFacultyIds } },
                    whereConditions
                ]
            },
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder
                } : {
                    firstName: 'asc'
                }
        });

        result = await prisma.faculty.findMany({
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

        total = result1.length
    }

    else {
        result = await prisma.faculty.findMany({
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

        total = await prisma.facultyEnrollment.count({
            where: {
                studentId: sId,
            },
        });
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

const getAllSpecificIncompleteStudentTask = async (
    id: string,
    filters: ITakFilterRequest,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

    const { id: sId } = studentInfo;

    const existingAssignedTask = await prisma.taskStudent.findMany({
        where: {
            studentId: sId
        },
        include: {
            task: true
        }
    });


    if (existingAssignedTask.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student is not assigned in any task");
    }



    const studentIncompleteTaskIds = existingAssignedTask
        .filter((taskItem) => taskItem.solution === null || taskItem.solution === undefined)
        .map((taskItem) => taskItem.taskId);



    let commonTaskIds: string[] = [];
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: taskSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: await Promise.all(
                Object.entries(filterData)
                    .filter(([key]) => key === 'facultyId')
                    .map(async ([, value]: [string, unknown]) => {
                        const facultyInfo = await prisma.faculty.findFirst({
                            where: {
                                id: value as string
                            }
                        });

                        if (!facultyInfo) {
                            throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist");
                        }

                        const tasks = await prisma.taskFaculty.findMany({
                            where: {
                                facultyId: value as string,
                            },
                            select: {
                                taskId: true,
                            },
                        });

                        if (!tasks) {
                            throw new ApiError(httpStatus.NOT_FOUND, "Faculty did not assign any task");
                        }

                        const facultyTaskIds = tasks.map((task) => task.taskId);
                        commonTaskIds = facultyTaskIds.filter(taskId => studentIncompleteTaskIds.includes(taskId));

                        return {};
                    })
            )
        });
    }


    let result = []
    let result1 = []
    let total = null



    const whereConditions: Prisma.TaskWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    if (commonTaskIds.length !== 0) {
        result1 = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: commonTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        result = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: commonTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        total = result1.length
    }

    else {
        result1 = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: studentIncompleteTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        result = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: studentIncompleteTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        total = result1.length

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

const getSingleSpecificStudentTask = async (
    id: string,
    taskId: string
): Promise<TaskStudent> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    })

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "student does not exist")
    }


    const { id: sId } = studentInfo
    const taskStudent = await prisma.taskStudent.findUnique({
        where: {
            taskId_studentId: {
                taskId: taskId,
                studentId: sId
            }
        },
        include: {
            task: {
                include: {
                    hint: true
                }
            }
        }
    });

    if (!taskStudent) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this student");
    }
    return taskStudent

}

const taskSolutionAddedByStudent = async (
    id: string,
    taskId: string,
    payload: Partial<TaskStudent>
): Promise<TaskStudent> => {

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });

    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "student does not exist");
    }

    const { id: sId } = studentInfo;

    const taskStudent = await prisma.taskStudent.findUnique({
        where: {
            taskId_studentId: {
                taskId: taskId,
                studentId: sId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskStudent) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this student");
    }

    const updatedTask = await prisma.taskStudent.update({
        where: {
            taskId_studentId: {
                taskId: taskId,
                studentId: sId
            }
        },
        data: payload,
    });

    if (!updatedTask) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task update failed");
    }

    return updatedTask;
};

const getAllSpecificCompleteStudentTask = async (
    id: string,
    filters: ITakFilterRequest,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });


    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

    const { id: sId } = studentInfo;

    const existingAssignedTask = await prisma.taskStudent.findMany({
        where: {
            studentId: sId
        },
        include: {
            task: true
        }
    });


    if (existingAssignedTask.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student is not assigned in any task");
    }



    const studentCompleteTaskIds = existingAssignedTask
        .filter((taskItem) => taskItem.solution !== null && taskItem.solution !== undefined)
        .map((taskItem) => taskItem.taskId);



    let commonTaskIds: string[] = [];
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: taskSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: await Promise.all(
                Object.entries(filterData)
                    .filter(([key]) => key === 'facultyId')
                    .map(async ([, value]: [string, unknown]) => {
                        const facultyInfo = await prisma.faculty.findFirst({
                            where: {
                                id: value as string
                            }
                        });

                        if (!facultyInfo) {
                            throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist");
                        }

                        const tasks = await prisma.taskFaculty.findMany({
                            where: {
                                facultyId: value as string,
                            },
                            select: {
                                taskId: true,
                            },
                        });

                        if (!tasks) {
                            throw new ApiError(httpStatus.NOT_FOUND, "Faculty did not assign any task");
                        }

                        const facultyTaskIds = tasks.map((task) => task.taskId);
                        commonTaskIds = facultyTaskIds.filter(taskId => studentCompleteTaskIds.includes(taskId));

                        return {};
                    })
            )
        });
    }

    const whereConditions: Prisma.TaskWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    let result = []
    let result1 = []
    let total = null

    if (commonTaskIds.length !== 0) {
        result1 = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: commonTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        result = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: commonTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        total = result1.length
        console.log(total)
    }

    else {

        result1 = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: studentCompleteTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        result = await prisma.task.findMany({
            where: {
                AND: [
                    { id: { in: studentCompleteTaskIds } },
                    whereConditions
                ]
            },
            include: {
                faculty: true,
                hint: true
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { title: 'asc' }
        });

        total = result1.length

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

const getAllFeedbackTask = async (
    id: string,
    filters: ITakFilterRequest,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const studentInfo = await prisma.student.findFirst({
        where: {
            userId: id
        }
    });


    if (!studentInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

    const { id: sId } = studentInfo;



}


export const StudentService = {
    getStudentByUserId,
    getStudentByStudentId,
    assignInterest,
    deleteInterest,
    getAssignInterest,
    assignSkill,
    updateSkillStatus,
    deleteSkill,
    getAssignSkill,
    getSingleSkill,
    assignRelatedWork,
    updateRelatedWorks,
    deleteRelatedWorks,
    getAssignRelatedWorks,
    getSingleRelatedWork,
    enrollFaculties,
    unenrollFaculty,
    getEnrolledFaculties,
    getAllSpecificIncompleteStudentTask,
    getSingleSpecificStudentTask,
    taskSolutionAddedByStudent,
    getAllSpecificCompleteStudentTask
}
