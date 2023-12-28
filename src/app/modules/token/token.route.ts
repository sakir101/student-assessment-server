import express from 'express';
import { TokenController } from './token.controller';

const router = express.Router();

router.get('/:userId/verify/:token', TokenController.verifyEmail)

export const TokenRoutes = router;