import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get('/:id',
    AdminController.getAdminByUserId)

router.get('/:id/admin-id',
    AdminController.getAdminByAdminId)

export const AdminRoutes = router