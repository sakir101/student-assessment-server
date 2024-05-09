import express from 'express';
import { InterestController } from './interest.controller';

const router = express.Router();

router.post('/create-interest',
    InterestController.createInterest)

router.get('/',
    InterestController.getAllInterest)

router.get('/:id',
    InterestController.getSingleInterest)

export const InterestRoutes = router;