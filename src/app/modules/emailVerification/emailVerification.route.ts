import express from 'express';
import { EmailVerificationController } from './emailVerifcation.controller';

const router = express.Router();

router.get('/:id/verify/:token', EmailVerificationController.emailVerifyRoute)
export const EmailVerificationRoutes = router;
