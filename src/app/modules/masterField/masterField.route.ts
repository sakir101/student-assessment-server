import express from 'express';
import { MasterFieldController } from './masterField.controller';

const router = express.Router();

router.post('/create-masterField',
    MasterFieldController.createMasterField)

router.get('/',
    MasterFieldController.getAllMasterFields)

router.get('/:id',
    MasterFieldController.getSingleMasterField)

router.patch('/:id/update-masterField',
    MasterFieldController.updateMasterFieldInfo)

export const MasterFieldRoutes = router;