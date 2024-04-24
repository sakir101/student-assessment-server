import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SkillValidation } from '../skill/skill.validation';
import { StudentController } from './student.controller';


const router = express.Router();

router.get('/:id',
    StudentController.getStudentByUserId)

router.get('/:id/student-id',
    StudentController.getStudentByStudentId)


router.get('/getInterest/:id',
    StudentController.getAssignInterest)

router.get('/getEnrolledFaculties/:id',
    StudentController.getEnrolledFaculties)

router.get('/getAllSpecificIncompleteTask/incomplete/:id',
    StudentController.getAllSpecificIncompleteStudentTask)

router.get('/:id/:taskId',
    StudentController.getSingleSpecificStudentTask)

router.get('/getAllSpecificCompleteTask/complete/:id',
    StudentController.getAllSpecificCompleteStudentTask)

router.patch('/:id/:interestId/skill-status',
    validateRequest(SkillValidation.skillUpdateZodSchema),
    StudentController.updateSkillStatus)

router.patch('/:id/:taskId',
    StudentController.taskSolutionAddedByStudent)



router.post('/:id/assign-interests',
    StudentController.assignInterest)

router.post('/:id/delete-interests',
    StudentController.deleteInterest)

router.post('/:id/assign-skills',
    StudentController.assignSkill)

router.post('/:id/enroll-faculties',
    StudentController.enrollFaculties)

router.post('/:id/unenroll-faculty',
    StudentController.unenrollFaculty)

export const StudentRoutes = router