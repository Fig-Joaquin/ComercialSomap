import { Router } from 'express';
import { /*assignRoleToUser, removeRoleFromUserById, getRolesByUserId ,*/deleteRolUsuario, getAllRolUsuarios, createRolUsuario} from '../controllers/rolUsuarioController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);
// router.post('/asignar-rol', assignRoleToUser);
// router.delete('/remove-role/:id', authMiddleware, roleMiddleware(['gerente']), removeRoleFromUserById);
// router.get('/roles/:id', authMiddleware, roleMiddleware(['gerente', 'administrativo']), getRolesByUserId);

router.post('/asignacion-rol', roleMiddleware(['gerente']), createRolUsuario); // Checked
// router.delete('/rol-usuario/:id', authMiddleware, roleMiddleware(['gerente']), deleteRolUsuario);
router.get('/roles-usuarios', roleMiddleware(['gerente']), getAllRolUsuarios); // Checked
router.delete('/eliminar-rol/:id', roleMiddleware(['gerente']), deleteRolUsuario); // Checked
export default router;
