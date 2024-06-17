import express from 'express';
import { MasterFieldController } from './masterField.controller';

const router = express.Router();

router.post('/create-masterField',
    MasterFieldController.createMasterField)

router.post('/:id/assign-subField',
    MasterFieldController.assignSubField)

router.post('/:id/unassign-subField',
    MasterFieldController.unassignSubField)

router.get('/',
    MasterFieldController.getAllMasterFields)

router.get('/:id',
    MasterFieldController.getSingleMasterField)

router.get('/:id/get-assign-subField',
    MasterFieldController.getAssignSubField)

router.get('/:id/get-unassign-subField',
    MasterFieldController.getUnassignSubField)

router.patch('/:id/update-masterField',
    MasterFieldController.updateMasterFieldInfo)

export const MasterFieldRoutes = router;