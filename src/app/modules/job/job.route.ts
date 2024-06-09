import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { JobController } from './job.controller';
import { JobValidation } from './job.validation';




const router = express.Router();

router.post('/create-job',
    validateRequest(JobValidation.createJobZodSchema),
    JobController.createJob)

router.get('/',
    JobController.getAllJobs)

router.get('/:id',
    JobController.getSingleJob)

router.patch('/:id/update-Job',
    validateRequest(JobValidation.updateJobZodSchema),
    JobController.updateJobInfo)

export const JobRoutes = router;