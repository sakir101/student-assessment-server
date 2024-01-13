import express from 'express';
import { InterestController } from './interest.controller';

const router = express.Router();

router.post('/create-interest',
    InterestController.createInterest)

router.get('/',
    InterestController.getAllInterest)

export const InterestRoutes = router;