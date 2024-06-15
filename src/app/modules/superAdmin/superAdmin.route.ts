import express from 'express';
import { SuperAdminController } from './superAdmin.controller';

const router = express.Router();
router.get('/get-admins',
    SuperAdminController.getAllAdmins)

router.get('/get-faculties',
    SuperAdminController.getAllFaculties)

router.get('/get-students',
    SuperAdminController.getAllStudents)
router.get('/:id',
    SuperAdminController.getSuperAdminByUserId)

router.get('/:id/superAdmin-id',
    SuperAdminController.getSuperAdminBySuperAdminId)



export const SuperAdminRoutes = router