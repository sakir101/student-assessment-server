import express from 'express';
import { FacultyController } from './faculty.controller';

const router = express.Router();

router.get('/:id/getSpecificFaculty',
    FacultyController.getSpecificFaculty)
router.post('/:id/assign-interests-faculty',
    FacultyController.assignInterestFaculty)

export const FacultyRoutes = router