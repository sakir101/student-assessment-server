import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RelatedWorksValidation } from '../relatedWorks/relatedWorks.validation';
import { TaskValidation } from '../task/task.validation';
import { FacultyController } from './faculty.controller';

const router = express.Router();


router.get('/:id',
    FacultyController.getFacultyByUserId)

router.get('/:id/faculty-id',
    FacultyController.getFacultyByFacultyId)

router.get('/getExpertise/:id',
    FacultyController.getAssignInterest)

router.get('/getRelatedWorksFaculty/:id',
    FacultyController.getAssignRelatedWorksFaculty)

router.get('/getSingleRelatedWorkFaculty/:id/:interestId',
    FacultyController.getSingleRelatedWorkFaculty)

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

router.get('/task/hint/:id',
    FacultyController.getSingleTaskHint)

router.get('/getAllSpecificCompleteTask/complete/student/:id',
    FacultyController.getAllCompleteStudentTasks)

router.get('/getAllSpecificCompleteTaskStudents/complete/task/:taskId',
    FacultyController.getAllCompleteTaskStudents)

router.patch('/:id/:interestId/related-works-faculty',
    validateRequest(RelatedWorksValidation.relatedWorksUpdateZodSchema),
    FacultyController.updateRelatedWorksFaculty)

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

router.post('/:id/:interestId/assign-related-works-faculty',
    validateRequest(RelatedWorksValidation.relatedWorksCreateZodSchema),
    FacultyController.assignRelatedWorkFaculty)

router.patch('/updateTaskFeedback/update/:taskId/:facultyId/:studentId',
    validateRequest(TaskValidation.updateTaskFeedback),
    FacultyController.updateTaskFeedback)

router.post('/:id/:taskId',
    validateRequest(TaskValidation.assignTaskHint),
    FacultyController.assignTaskHint)

router.post('/assignTask/:id/:taskId',
    FacultyController.assignTask)

router.post('/unassignTask/:id/:taskId',
    FacultyController.unassignTask)

router.post('/assignTaskFeedback/:taskId/:facultyId/:studentId',
    validateRequest(TaskValidation.assignTaskFeedback),
    FacultyController.assignTaskFeedback)

router.delete('/:taskId/:hintId',
    FacultyController.removeTaskHint)

router.delete('/removeTask/:id/:taskId',
    FacultyController.removeSingleSpecificFacultyTask)

router.delete('/:id/:interestId/related-works',
    FacultyController.deleteRelatedWorksFaculty)

router.delete('/:id/:taskId/delete-specific-task',
    FacultyController.deleteSpecificTask)

export const FacultyRoutes = router