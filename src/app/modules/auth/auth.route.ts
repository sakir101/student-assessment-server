import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/login', AuthController.loginUser)
router.post('/renew-password', AuthController.renewPassword)
router.post('/:id/update-password', AuthController.updatePassword)

export const AuthRoutes = router;