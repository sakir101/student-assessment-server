import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { studentFilterableFields } from "../student/student.constant";
import { taskFilterableFields } from "../task/task.constant";
import { facultyFilterableFields } from "./faculty.constant";
import { FacultyService } from "./faculty.service";

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

export const FacultyController = {
    assignInterestFaculty,
    getSpecificFaculty,
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