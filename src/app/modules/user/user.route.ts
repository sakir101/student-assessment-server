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

router.post('/create-admin',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.adminFileUploadZodSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    }
)

router.post('/create-superAdmin',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.superAdminFileUploadZodSchema.parse(JSON.parse(req.body.data))
        return UserController.createSuperAdmin(req, res, next)
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

router.patch('/update-admin/:id',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.adminUpdateZodSchema.parse(JSON.parse(req.body.data))
        return UserController.updateAdminInfo(req, res, next)
    }
)

router.patch('/update-superAdmin/:id',
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.superAdminUpdateZodSchema.parse(JSON.parse(req.body.data))
        return UserController.updateSuperAdminInfo(req, res, next)
    }
)

export const UserRoutes = router;