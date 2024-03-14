import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TaskValidation } from '../task/task.validation';
import { FacultyController } from './faculty.controller';

const router = express.Router();

router.get('/:id',
    FacultyController.getFacultyByUserId)

router.get('/:id/faculty-id',
    FacultyController.getFacultyByFacultyId)

router.get('/getExpertise/:id',
    FacultyController.getAssignInterest)

router.get('/:id/getSpecificFaculty',
    FacultyController.getSpecificFaculty)

router.get('/getEnrolledStudents/:id',
    FacultyController.getEnrolledStudents)

router.get('/:id/getSpecificFacultyTask',
    FacultyController.getAllSpecificFacultyTask)

router.get('/:id/:taskId',
    FacultyController.getSingleSpecificFacultyTask)

router.get('/getAssignTaskStudents/:id/:taskId',
    FacultyController.getAssignTaskStudent)

router.get('/getUnassignTaskStudents/:id/:taskId',
    FacultyController.getUnassignTaskStudent)

router.patch('/:id/:taskId',
    validateRequest(TaskValidation.update),
    FacultyController.updateSingleSpecificFacultyTask)

router.patch('/updateHint/:taskId/:hintId',
    validateRequest(TaskValidation.assignTaskHint),
    FacultyController.updateTaskHint)

router.post('/:id/delete-expertise',
    FacultyController.deleteInterest)

router.post('/:id/assign-interests-faculty',
    FacultyController.assignInterestFaculty)

router.post('/:id/:taskId',
    validateRequest(TaskValidation.assignTaskHint),
    FacultyController.assignTaskHint)

router.post('/assignTask/:id/:taskId',
    FacultyController.assignTask)

router.post('/unassignTask/:id/:taskId',
    FacultyController.unassignTask)

router.delete('/:taskId/:hintId',
    FacultyController.removeTaskHint)

router.delete('/removeTask/:id/:taskId',
    FacultyController.removeSingleSpecificFacultyTask)

export const FacultyRoutes = router