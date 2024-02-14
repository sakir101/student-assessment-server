import express from 'express';
import { StudentController } from './student.controller';


const router = express.Router();

router.get('/:id',
    StudentController.getStudentByUserId)

router.get('/getInterest/:id',
    StudentController.getAssignInterest)

router.get('/getEnrolledFaculties/:id',
    StudentController.getEnrolledFaculties)

router.post('/:id/assign-interests',
    StudentController.assignInterest)

router.post('/:id/delete-interests',
    StudentController.deleteInterest)

router.post('/:id/enroll-faculties',
    StudentController.enrollFaculties)

router.post('/:id/unenroll-faculty',
    StudentController.unenrollFaculty)

export const StudentRoutes = router