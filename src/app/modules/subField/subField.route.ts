import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SubFieldController } from './subField.controller';
import { SubFieldValidation } from './subField.validation';


const router = express.Router();

router.post('/create-subField',
    validateRequest(SubFieldValidation.createSubFieldZodSchema),
    SubFieldController.createSubField)

router.post('/:id/assign-job',
    SubFieldController.assignJob)

router.post('/:id/assign-course',
    SubFieldController.assignCourse)

router.get('/',
    SubFieldController.getAllSubFields)

router.get('/:id',
    SubFieldController.getSingleSubField)

router.patch('/:id/update-SubField',
    validateRequest(SubFieldValidation.updateSubFieldZodSchema),
    SubFieldController.updateSubFieldInfo)

export const SubFieldRoutes = router;