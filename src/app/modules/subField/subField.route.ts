import express, { NextFunction, Request, Response } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { SubFieldController } from './subField.controller';
import { SubFieldValidation } from './subField.validation';


const router = express.Router();



router.post('/create-subField',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SubFieldValidation.createSubFieldZodSchema.parse(JSON.parse(req.body.data))
        return SubFieldController.createSubField(req, res, next)
    }
)

router.post('/:id/assign-job',
    SubFieldController.assignJob)

router.post('/:id/assign-course',
    SubFieldController.assignCourse)

router.post('/:id/unassign-job',
    SubFieldController.unassignJob)

router.post('/:id/unassign-course',
    SubFieldController.unassignCourse)

router.get('/',
    SubFieldController.getAllSubFields)

router.get('/:id',
    SubFieldController.getSingleSubField)

router.get('/:id/get-assign-job',
    SubFieldController.getAssignJob)

router.get('/:id/get-unassign-job',
    SubFieldController.getUnassignJob)

router.get('/:id/get-assign-course',
    SubFieldController.getAssignCourse)

router.get('/:id/get-unassign-course',
    SubFieldController.getUnassignCourse)

router.patch('/:id/update-SubField',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SubFieldValidation.updateSubFieldZodSchema.parse(JSON.parse(req.body.data))
        return SubFieldController.updateSubFieldInfo(req, res, next)
    }
)

export const SubFieldRoutes = router;