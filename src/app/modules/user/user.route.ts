import express, { NextFunction, Request, Response } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';


const router = express.Router();



router.post('/create-student',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.fileUploadZodSchema.parse(JSON.parse(req.body.data))
        return UserController.createStudent(req, res, next)
    }
)

export const UserRoutes = router;