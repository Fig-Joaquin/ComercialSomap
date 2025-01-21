import { Router } from 'express';
import { createRol, getAllRoles, /*deleteRolById, deleteRolByName,*/ updateRol } from '../controllers/rolesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware)
router.post('/roles', roleMiddleware(["gerente"]), createRol); // CHECKED
router.get('/roles', roleMiddleware(["gerente"]), getAllRoles); // CHEKED
// router.delete('/roles/:id', deleteRolById);
// router.delete('/roles/name/:name', deleteRolByName);
router.put('/roles/:id', roleMiddleware(["gerente"]), updateRol); //! NO CHECKED

export default router;
