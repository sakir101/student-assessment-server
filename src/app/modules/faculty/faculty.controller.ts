import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { interestFilterableFields } from "../interest/interest.constant";
import { studentFilterableFields } from "../student/student.constant";
import { taskFilterableFields } from "../task/task.constant";
import { facultyFilterableFields } from "./faculty.constant";
import { FacultyService } from "./faculty.service";

const getFacultyByUserId = catchAsync(async (req: Request, res: Response) => {


    const result = await FacultyService.getFacultyByUserId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty data fetched by user id",
        data: result
    })
})

const getFacultyByFacultyId = catchAsync(async (req: Request, res: Response) => {


    const result = await FacultyService.getFacultyByFacultyId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty data fetched by user id",
        data: result
    })
})

const assignInterestFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FacultyService.assignInterestFaculty(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign interest data successfully",
        data: result
    })
})

const getAssignInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, interestFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getAssignInterest(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign interest data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const deleteInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await FacultyService.deleteInterest(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete expertise data successfully",
        data: result
    })
})

const assignRelatedWorkFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    const result = await FacultyService.assignRelatedWorkFaculty(id, interestId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign related works data successfully",
        data: result
    })
})

const updateRelatedWorksFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    const result = await FacultyService.updateRelatedWorksFaculty(id, interestId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Related works updated successfully',
        data: result
    });
});

const deleteRelatedWorksFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;

    const result = await FacultyService.deleteRelatedWorksFaculty(id, interestId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete related works data successfully",
        data: result
    })
})

const getAssignRelatedWorksFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, interestFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getAssignRelatedWorksFaculty(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign related works data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSingleRelatedWorkFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    const result = await FacultyService.getSingleRelatedWorkFaculty(id, interestId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Related work retrieved successfully",
        data: result
    })
})

const getSpecificFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, facultyFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getSpecificFaculties(filters, options, id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specific Faculty Found Successfully",
        meta: result.meta,
        data: result.data
    })
})

const getEnrolledStudents = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, studentFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getEnrolledStudents(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Enrolled students retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getAllSpecificFacultyTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, taskFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getAllSpecificFacultyTask(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSingleSpecificFacultyTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await FacultyService.getSingleSpecificFacultyTask(id, taskId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single task data retrieved successfully",
        data: result
    })
})

const updateSingleSpecificFacultyTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await FacultyService.updateSingleSpecificFacultyTask(id, taskId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Task updated successfully',
        data: result
    });
});

const assignTaskHint = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await FacultyService.assignTaskHint(id, taskId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Task Hint assign successfully',
        data: result
    });
});

const getSingleTaskHint = catchAsync(async (req: Request, res: Response) => {


    const result = await FacultyService.getSingleTaskHint(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task hint get successfully by id",
        data: result
    })
})

const updateTaskHint = catchAsync(async (req: Request, res: Response) => {
    const { taskId, hintId } = req.params;
    const result = await FacultyService.updateTaskHint(taskId, hintId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Task Hint update successfully',
        data: result
    });
});

const removeTaskHint = catchAsync(async (req: Request, res: Response) => {
    const { taskId, hintId } = req.params;
    const result = await FacultyService.removeTaskHint(taskId, hintId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Task Hint removed successfully',
        data: result
    });
});

const deleteSpecificTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;

    const result = await FacultyService.deleteSpecificTask(id, taskId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete task data successfully",
        data: result
    })
})

const assignTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await FacultyService.assignTask(id, taskId, req.body.student)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task assign successful",
        data: result
    })
})

const getAssignTaskStudent = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const filters = pick(req.query, studentFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getAssignTaskStudent(id, taskId, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign task students Found Successfully",
        meta: result.meta,
        data: result.data
    })
})

const getUnassignTaskStudent = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const filters = pick(req.query, studentFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getUnassignTaskStudent(id, taskId, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign task students Found Successfully",
        meta: result.meta,
        data: result.data
    })
})

const unassignTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await FacultyService.unassignTask(id, taskId, req.body.student)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task unassign successful",
        data: result
    })
})

const removeSingleSpecificFacultyTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await FacultyService.removeSingleSpecificFacultyTask(id, taskId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Task delete successfully',
        data: result
    });
});

const getAllCompleteStudentTasks = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, taskFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await FacultyService.getAllCompleteStudentTasks(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getAllCompleteTaskStudents = catchAsync(async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const result = await FacultyService.getAllCompleteTaskStudents(taskId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Completed task student successfully",
        data: result
    })
})

const assignTaskFeedback = catchAsync(async (req: Request, res: Response) => {
    const { taskId, facultyId, studentId } = req.params;
    const result = await FacultyService.assignTaskFeedback(taskId, facultyId, studentId, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Completed task student successfully",
        data: result
    })
})

const updateTaskFeedback = catchAsync(async (req: Request, res: Response) => {
    const { taskId, facultyId, studentId } = req.params;
    const result = await FacultyService.updateTaskFeedback(taskId, facultyId, studentId, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Completed task student successfully",
        data: result
    })
})

export const FacultyController = {
    getFacultyByUserId,
    getFacultyByFacultyId,
    assignInterestFaculty,
    getAssignInterest,
    deleteInterest,
    assignRelatedWorkFaculty,
    updateRelatedWorksFaculty,
    deleteRelatedWorksFaculty,
    getAssignRelatedWorksFaculty,
    getSingleRelatedWorkFaculty,
    getSpecificFaculty,
    getEnrolledStudents,
    getAllSpecificFacultyTask,
    getSingleSpecificFacultyTask,
    updateSingleSpecificFacultyTask,
    assignTaskHint,
    getSingleTaskHint,
    updateTaskHint,
    removeTaskHint,
    assignTask,
    getAssignTaskStudent,
    getUnassignTaskStudent,
    unassignTask,
    removeSingleSpecificFacultyTask,
    getAllCompleteStudentTasks,
    getAllCompleteTaskStudents,
    assignTaskFeedback,
    updateTaskFeedback,
    deleteSpecificTask
}