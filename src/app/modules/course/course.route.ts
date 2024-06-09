import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';



const router = express.Router();

router.post('/create-course',
    validateRequest(CourseValidation.createCourseZodSchema),
    CourseController.createCourse)

router.get('/',
    CourseController.getAllCourses)

router.get('/:id',
    CourseController.getSingleCourse)

router.patch('/:id/update-course',
    validateRequest(CourseValidation.updateCourseZodSchema),
    CourseController.updateCourseInfo)

export const courseRoutes = router;