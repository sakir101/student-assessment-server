import express from 'express';
import { CareerPredictController } from './careerPredict.controller';

const router = express.Router();

router.get('/:id', CareerPredictController.careerPrediction)

export const CareerRoutes = router;