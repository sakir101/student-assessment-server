import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TaskController } from './task.controller';
import { TaskValidation } from './task.validation';

const router = express.Router();

router.post('/:id',
    validateRequest(TaskValidation.create),
    TaskController.createTask)


export const TaskRoutes = router