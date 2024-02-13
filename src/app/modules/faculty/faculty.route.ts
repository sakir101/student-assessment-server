import express from 'express';
import { FacultyController } from './faculty.controller';

const router = express.Router();

router.post('/:id/assign-interests-faculty',
    FacultyController.assignInterestFaculty)

export const FacultyRoutes = router