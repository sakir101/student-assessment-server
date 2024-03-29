import { Faculty, Interest, InterestFaculty, Prisma, Student, Task } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { interestSearchableFields } from "../interest/interest.constant";
import { IInterestFilterRequest } from "../interest/interest.interface";
import { studentSearchableFields } from "../student/student.constant";
import { IStudentFilterRequest } from "../student/student.interface";
import { taskSearchableFields } from "../task/task.constant";
import { ITakFilterRequest } from "../task/task.interface";
import { facultySearchableFields } from "./faculty.constant";
import { IFacultyFilterRequest, TaskHintPayload } from "./faculty.interface";

const getFacultyByUserId = async (id: string): Promise<Faculty | null> => {
    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        },
        include: {
            user: true
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }


    return facultyInfo;
}

const getFacultyByFacultyId = async (id: string): Promise<Faculty | null> => {
    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            id
        },
        include: {
            user: true
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }


    return facultyInfo;
}

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

const getAssignInterest = async (
    id: string,
    filters: IInterestFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Interest[]>> => {

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
    const existingInterests = await prisma.interestFaculty.findMany({
        where: {
            facultyId: fId
        },
        include: {
            interest: true
        }
    })




    if (existingInterests.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty did not select any interest");
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

    const total = await prisma.interestFaculty.count({
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

const deleteInterest = async (
    id: string,
    payload: string[]
): Promise<InterestFaculty[] | ''> => {
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

    if (existingInterests) {
        await prisma.interestFaculty.deleteMany({
            where: {
                facultyId: fId,
                interestId: {
                    in: payload,
                },

            }
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

    return ""


}

const getSpecificFaculties = async (
    filters: IFacultyFilterRequest,
    options: IPaginationOptions,
    id: string
): Promise<IGenericResponse<Faculty[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    console.log(Object.keys(filterData).length > 0)
    console.log(filterData)
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

    if (searchTerm || Object.keys(filterData).length > 0) {

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


    const existingEnrolledFaculties = await prisma.facultyEnrollment.findMany({
        where: {
            studentId: sId
        }
    });

    const existingEnrolledFacultyIds = existingEnrolledFaculties.map((faculty) => faculty.facultyId);

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

    const searchFacultyIds = result.map((faculty) => faculty.id)

    const filterFacultyIds = searchFacultyIds.filter((facultyId) => !existingEnrolledFacultyIds.includes(facultyId))

    const result1 = await prisma.faculty.findMany({
        where: {
            AND: [
                { id: { in: filterFacultyIds } },
                whereConditions
            ]
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            firstName: 'asc'
        }
    });



    const total = filterFacultyIds.length;

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result1
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

const getAllSpecificFacultyTask = async (
    id: string,
    filters: ITakFilterRequest,
    options: IPaginationOptions
) => {

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
    const existingCreatedTask = await prisma.taskFaculty.findMany({
        where: {
            facultyId: fId
        },
        include: {
            task: true
        }
    })




    if (existingCreatedTask.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty did not create any task");
    }

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: taskSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.TaskWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};



    const taskIds: string[] = [];

    existingCreatedTask.forEach(item => {
        taskIds.push(item.taskId);
    });

    const result = await prisma.task.findMany({
        where: {
            AND: [
                { id: { in: taskIds } },
                whereConditions
            ]
        },
        include: {
            hint: true
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

    const total = await prisma.taskFaculty.count({
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

const getSingleSpecificFacultyTask = async (
    id: string,
    taskId: string
): Promise<Task> => {
    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }


    const { id: fId } = facultyInfo
    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
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

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }
    return taskFaculty.task

}

const updateSingleSpecificFacultyTask = async (
    id: string,
    taskId: string,
    payload: Partial<Task>
): Promise<Task> => {

    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    });

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist");
    }

    const { id: fId } = facultyInfo;

    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }

    const updatedTask = await prisma.task.update({
        where: {
            id: taskFaculty.task.id
        },
        data: payload,
        include: {
            hint: true
        }
    });

    if (!updatedTask) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task update failed");
    }

    return updatedTask;
};

const assignTaskHint = async (
    id: string,
    taskId: string,
    payload: TaskHintPayload
): Promise<Task | null> => {
    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }


    const { id: fId } = facultyInfo
    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }


    const createTaskHint = await prisma.taskHint.create({
        data: {
            description: payload.description,
            task: {
                connect: {
                    id: taskId
                }
            }
        }
    });

    if (!createTaskHint) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task hint can not be created");
    }

    const taskWithHint = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            hint: true
        }
    });

    if (!taskWithHint) {
        return null;
    }

    return taskWithHint

}

const updateTaskHint = async (
    taskId: string,
    hintId: string,
    payload: TaskHintPayload
): Promise<Task | null> => {

    const taskHint = await prisma.taskHint.findUnique({
        where: {
            id: hintId,
            taskId: taskId,
        }
    });

    if (!taskHint) {
        throw new ApiError(httpStatus.NOT_FOUND, "Hint not found for this task");
    }


    const updateHint = await prisma.taskHint.update({
        where: {
            id: hintId
        },
        data: {
            description: payload.description
        }
    });

    if (!updateHint) {
        throw new ApiError(httpStatus.NOT_FOUND, "Hint can not be updated");
    }

    const taskWithHint = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            hint: true
        }
    });

    if (!taskWithHint) {
        return null;
    }

    return taskWithHint

}

const removeTaskHint = async (
    taskId: string,
    hintId: string
): Promise<Task | null> => {

    const taskHint = await prisma.taskHint.findUnique({
        where: {
            id: hintId,
            taskId: taskId,
        }
    });

    if (!taskHint) {
        throw new ApiError(httpStatus.NOT_FOUND, "Hint not found for this task");
    }


    const removeHint = await prisma.taskHint.delete({
        where: {
            id: hintId
        }
    });

    if (!removeHint) {
        throw new ApiError(httpStatus.NOT_FOUND, "Hint can not be deleted");
    }

    const taskWithHint = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            hint: true
        }
    });

    if (!taskWithHint) {
        return null;
    }

    return taskWithHint

}

const assignTask = async (
    id: string,
    taskId: string,
    payload: string[]
): Promise<Task | null> => {

    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }

    const { id: fId } = facultyInfo

    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }
    const existingEnrolledStudents = await prisma.facultyEnrollment.findMany({
        where: {
            facultyId: fId,
            studentId: {
                in: payload,
            },
        },
    });


    const enrolledStudentsIds = existingEnrolledStudents.map((student) => student.studentId);



    const unenrolledStudentsIds = payload.filter((studentId) => !enrolledStudentsIds.includes(studentId));

    if (unenrolledStudentsIds.length > 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Students not found for this faculty");
    }

    const assignTaskStudents = await prisma.taskStudent.createMany({
        data: enrolledStudentsIds.map((studentId) => ({
            studentId,
            taskId: taskId,
        })),
    });

    if (!assignTaskStudents) {
        throw new ApiError(httpStatus.NOT_FOUND, "Assign task failed");
    }

    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            hint: true,
            students: true
        }
    });

    if (!task) {
        return null;
    }

    return task
}

const getAssignTaskStudent = async (
    id: string,
    taskId: string,
    filters: IFacultyFilterRequest,
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

    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }

    const taskAssignStudents = await prisma.taskStudent.findMany({
        where: {
            taskId
        },
        include: {
            student: true
        }
    })

    if (!taskAssignStudents) {
        throw new ApiError(httpStatus.NOT_FOUND, "No student assign in this task");
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



    const assignTaskStudentIds: string[] = [];

    taskAssignStudents.forEach(item => {
        assignTaskStudentIds.push(item.studentId);
    });

    const result = await prisma.student.findMany({
        where: {
            AND: [
                { id: { in: assignTaskStudentIds } },
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

    const total = await prisma.taskStudent.count({
        where: {
            taskId
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

const getUnassignTaskStudent = async (
    id: string,
    taskId: string,
    filters: IFacultyFilterRequest,
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

    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }

    const taskAssignStudents = await prisma.taskStudent.findMany({
        where: {
            taskId
        },
        include: {
            student: true
        }
    })

    if (!taskAssignStudents) {
        throw new ApiError(httpStatus.NOT_FOUND, "No student assign in this task");
    }

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

    const existingEnrolledStudentIds = existingEnrolledStudents.map((student) => student.studentId);

    const assignTaskStudentIds: string[] = [];

    taskAssignStudents.forEach(item => {
        assignTaskStudentIds.push(item.studentId);
    });

    const studentEnrolledNotAssignTaskIds = existingEnrolledStudentIds.filter((studentId) => !assignTaskStudentIds.includes(studentId));


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

    const result = await prisma.student.findMany({
        where: {
            AND: [
                { id: { in: studentEnrolledNotAssignTaskIds } },
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


    const total = studentEnrolledNotAssignTaskIds.length;


    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };

}

const unassignTask = async (
    id: string,
    taskId: string,
    payload: string[]
): Promise<Task | null> => {

    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }

    const { id: fId } = facultyInfo

    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }
    const existingEnrolledStudents = await prisma.facultyEnrollment.findMany({
        where: {
            facultyId: fId,
            studentId: {
                in: payload,
            },
        },
    });


    const enrolledStudentsIds = existingEnrolledStudents.map((student) => student.studentId);



    const unenrolledStudentsIds = payload.filter((studentId) => !enrolledStudentsIds.includes(studentId));

    if (unenrolledStudentsIds.length > 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Students not found for this faculty");
    }

    const unassignTaskStudents = await prisma.taskStudent.deleteMany({
        where: {
            studentId: {
                in: payload,
            },
            taskId: taskId,
        },
    });

    if (!unassignTaskStudents) {
        throw new ApiError(httpStatus.NOT_FOUND, "Unassign task failed");
    }

    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            hint: true,
            students: true
        }
    });

    if (!task) {
        return null;
    }

    return task
}

const removeSingleSpecificFacultyTask = async (
    id: string,
    taskId: string
): Promise<Task> => {

    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    });

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist");
    }

    const { id: fId } = facultyInfo;

    const taskFaculty = await prisma.taskFaculty.findUnique({
        where: {
            taskId_facultyId: {
                taskId: taskId,
                facultyId: fId
            }
        },
        include: {
            task: true
        }
    });

    if (!taskFaculty) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found for this faculty");
    }

    const taskDelete = await prisma.$transaction(async (transactionClient) => {

        const taskAssignStudents = await prisma.taskStudent.findMany({
            where: {
                taskId
            },
            include: {
                student: true
            }
        })

        if (taskAssignStudents) {
            const unassignTaskAllStudents = await transactionClient.taskStudent.deleteMany({
                where: {
                    taskId: taskId,
                },
            });

            if (!unassignTaskAllStudents) {
                throw new ApiError(httpStatus.NOT_FOUND, "Unassign task failed");
            }
        }


        const taskHintsForTask = await transactionClient.taskHint.findMany({
            where: {
                taskId: taskId
            }
        });

        if (taskHintsForTask) {
            const removeHintsForTask = await transactionClient.taskHint.deleteMany({
                where: {
                    taskId: taskId
                }
            });

            if (!removeHintsForTask) {
                throw new ApiError(httpStatus.NOT_FOUND, "Remove task hint failed");
            }
        }

        const deleteTaskFromFaculty = await transactionClient.taskFaculty.deleteMany({
            where: {
                taskId: taskId
            }
        });

        if (!deleteTaskFromFaculty) {
            throw new ApiError(httpStatus.NOT_FOUND, "Remove task failed");
        }

        const deleteTask = await transactionClient.task.delete({
            where: {
                id: taskId
            }
        });

        if (!deleteTask) {
            throw new ApiError(httpStatus.NOT_FOUND, "Delete task failed");
        }
        return deleteTask

    })

    return taskDelete
};




export const FacultyService = {
    getFacultyByUserId,
    getFacultyByFacultyId,
    assignInterestFaculty,
    getAssignInterest,
    deleteInterest,
    getSpecificFaculties,
    getEnrolledStudents,
    getAllSpecificFacultyTask,
    getSingleSpecificFacultyTask,
    updateSingleSpecificFacultyTask,
    assignTaskHint,
    updateTaskHint,
    removeTaskHint,
    assignTask,
    getAssignTaskStudent,
    getUnassignTaskStudent,
    unassignTask,
    removeSingleSpecificFacultyTask
}
