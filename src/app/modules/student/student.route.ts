import express from 'express';
import { StudentController } from './student.controller';


const router = express.Router();

router.get('/:id',
    StudentController.getStudentByUserId)

router.get('/getInterest/:id',
    StudentController.getAssignInterest)

router.post('/:id/assign-interests',
    StudentController.assignInterest)

router.post('/:id/delete-interests',
    StudentController.deleteInterest)

export const StudentRoutes = router