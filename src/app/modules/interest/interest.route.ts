import express from 'express';
import { InterestController } from './interest.controller';

const router = express.Router();

router.post('/create-interest',
    InterestController.createInterest)

export const InterestRoutes = router;