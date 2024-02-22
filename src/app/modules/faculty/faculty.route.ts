import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TaskValidation } from '../task/task.validation';
import { FacultyController } from './faculty.controller';

const router = express.Router();

router.get('/:id/getSpecificFaculty',
    FacultyController.getSpecificFaculty)

router.get('/getEnrolledStudents/:id',
    FacultyController.getEnrolledStudents)

router.get('/:id/getSpecificFacultyTask',
    FacultyController.getAllSpecificFacultyTask)

router.get('/:id/:taskId',
    FacultyController.getSingleSpecificFacultyTask)

router.patch('/:id/:taskId',
    validateRequest(TaskValidation.update),
    FacultyController.updateSingleSpecificFacultyTask)

router.patch('/updateHint/:taskId/:hintId',
    validateRequest(TaskValidation.assignTaskHint),
    FacultyController.updateTaskHint)

router.post('/:id/assign-interests-faculty',
    FacultyController.assignInterestFaculty)

router.post('/:id/:taskId',
    validateRequest(TaskValidation.assignTaskHint),
    FacultyController.assignTaskHint)

router.delete('/:taskId/:hintId',
    FacultyController.removeTaskHint)

export const FacultyRoutes = router