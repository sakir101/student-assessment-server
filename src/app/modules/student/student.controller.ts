import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { facultyFilterableFields } from "../faculty/faculty.constant";
import { interestFilterableFields } from "../interest/interest.constant";
import { taskFilterableFields } from "../task/task.constant";
import { StudentService } from "./student.service";

const getStudentByUserId = catchAsync(async (req: Request, res: Response) => {


    const result = await StudentService.getStudentByUserId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student data fetched by user id",
        data: result
    })
})

const getStudentByStudentId = catchAsync(async (req: Request, res: Response) => {


    const result = await StudentService.getStudentByStudentId(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student data fetched by student id",
        data: result
    })
})

const assignInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentService.assignInterest(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign interest data successfully",
        data: result
    })
})

const deleteInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await StudentService.deleteInterest(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete interest data successfully",
        data: result
    })
})

const getAssignInterest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, interestFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getAssignInterest(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign interest data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const assignSkill = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentService.assignSkill(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign skill data successfully",
        data: result
    })
})

const updateSkillStatus = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    console.log(req.body)
    const result = await StudentService.updateSkillStatus(id, interestId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Skill status updated successfully',
        data: result
    });
});

const deleteSkill = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await StudentService.deleteSkill(id, req.body.interest)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete skill data successfully",
        data: result
    })
})

const getAssignSkill = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, interestFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getAssignSkill(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign skill data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSingleSkill = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    const result = await StudentService.getSingleSkill(id, interestId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Skill retrieved successfully",
        data: result
    })
})

const assignRelatedWork = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    const result = await StudentService.assignRelatedWork(id, interestId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign related works data successfully",
        data: result
    })
})

const updateRelatedWorks = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    const result = await StudentService.updateRelatedWorks(id, interestId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Related works updated successfully',
        data: result
    });
});

const deleteRelatedWorks = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;

    const result = await StudentService.deleteRelatedWorks(id, interestId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete related works data successfully",
        data: result
    })
})

const getAssignRelatedWorks = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, interestFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getAssignRelatedWorks(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Assign related works data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSingleRelatedWork = catchAsync(async (req: Request, res: Response) => {
    const { id, interestId } = req.params;
    const result = await StudentService.getSingleRelatedWork(id, interestId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Related work retrieved successfully",
        data: result
    })
})

const enrollFaculties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentService.enrollFaculties(id, req.body.faculty)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty enrolled successfully",
        data: result
    })
})

const unenrollFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await StudentService.unenrollFaculty(id, req.body.faculty)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty unenrolled successfully",
        data: result
    })
})

const getEnrolledFaculties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, facultyFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getEnrolledFaculties(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Enrolled faculties retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getAllSpecificIncompleteStudentTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, taskFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getAllSpecificIncompleteStudentTask(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSingleSpecificStudentTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await StudentService.getSingleSpecificStudentTask(id, taskId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single task data retrieved successfully",
        data: result
    })
})

const taskSolutionAddedByStudent = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await StudentService.taskSolutionAddedByStudent(id, taskId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Task solution added successfully',
        data: result
    });
});

const getAllSpecificCompleteStudentTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, taskFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getAllSpecificCompleteStudentTask(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getAllFeedbackTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, taskFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const result = await StudentService.getAllFeedbackTask(id, filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task feedback retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSpecificFeedbackTask = catchAsync(async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const result = await StudentService.getSpecificFeedbackTask(id, taskId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single task feedback retrieved successfully",
        data: result
    })
})

export const StudentController = {
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
    getAllSpecificCompleteStudentTask,
    getAllFeedbackTask,
    getSpecificFeedbackTask
}