import express from 'express';
import { StudentController } from './student.controller';


const router = express.Router();

router.post('/:id/assign-interests',
    StudentController.assignInterest)

router.post('/:id/delete-interests',
    StudentController.deleteInterest)

export const StudentRoutes = router