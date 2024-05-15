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

router.patch('/update-student/:id',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.studentUpdateZodSchema.parse(JSON.parse(req.body.data))
        return UserController.updateStudentInfo(req, res, next)
    }
)

router.patch('/update-faculty/:id',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.facultyUpdateZodSchema.parse(JSON.parse(req.body.data))
        return UserController.updateFacultyInfo(req, res, next)
    }
)

export const UserRoutes = router;