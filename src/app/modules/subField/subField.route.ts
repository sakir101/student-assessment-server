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

router.get('/',
    SubFieldController.getAllSubFields)

router.get('/:id',
    SubFieldController.getSingleSubField)

router.patch('/:id/update-SubField',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SubFieldValidation.updateSubFieldZodSchema.parse(JSON.parse(req.body.data))
        return SubFieldController.updateSubFieldInfo(req, res, next)
    }
)

export const SubFieldRoutes = router;