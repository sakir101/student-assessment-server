import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RelatedWorksValidation } from '../relatedWorks/relatedWorks.validation';
import { SkillValidation } from '../skill/skill.validation';
import { StudentController } from './student.controller';


const router = express.Router();

router.get('/:id',
    StudentController.getStudentByUserId)

router.get('/:id/student-id',
    StudentController.getStudentByStudentId)

router.get('/getInterest/:id',
    StudentController.getAssignInterest)

router.get('/getSkill/:id',
    StudentController.getAssignSkill)

router.get('/getRelatedWorks/:id',
    StudentController.getAssignRelatedWorks)

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

router.patch('/:id/:interestId/related-works',
    validateRequest(RelatedWorksValidation.relatedWorksUpdateZodSchema),
    StudentController.updateRelatedWorks)

router.patch('/:id/:taskId',
    StudentController.taskSolutionAddedByStudent)

router.post('/:id/assign-interests',
    StudentController.assignInterest)

router.post('/:id/delete-interests',
    StudentController.deleteInterest)

router.post('/:id/assign-skills',
    StudentController.assignSkill)

router.post('/:id/delete-skills',
    StudentController.deleteSkill)

router.post('/:id/:interestId/assign-related-works',
    validateRequest(RelatedWorksValidation.relatedWorksCreateZodSchema),
    StudentController.assignRelatedWork)

router.post('/:id/enroll-faculties',
    StudentController.enrollFaculties)

router.post('/:id/unenroll-faculty',
    StudentController.unenrollFaculty)

router.delete('/:id/:interestId/related-works',
    StudentController.deleteRelatedWorks)

export const StudentRoutes = router