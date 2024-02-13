import express, { NextFunction, Request, Response } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';


const router = express.Router();



router.post('/create-student',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.studentFileUploadZodSchema.parse(JSON.parse(req.body.data))
        return UserController.createStudent(req, res, next)
    }
)

router.post('/create-faculty',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.facultyFileUploadZodSchema.parse(JSON.parse(req.body.data))
        return UserController.createFaculty(req, res, next)
    }
)

export const UserRoutes = router;