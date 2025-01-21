import { Router } from 'express';
import { createUsuario, updateUsuario, getAllUsuarios, getUsuarioById, deleteUsuario, resetUsuarioPassword } from '../controllers/usuarioController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para usuarios
router.post('/crear-usuario', roleMiddleware(['gerente']), createUsuario); // Checked
router.put('/cambiar-password/:id', roleMiddleware(['gerente']),updateUsuario); //! NO CHECKED
router.get('/usuarios', roleMiddleware(['gerente']), getAllUsuarios); // Checked 
router.get('/usuarios/:id', roleMiddleware(['gerente']), getUsuarioById); // Checked 
router.delete('/usuarios/:id', roleMiddleware(['gerente']), deleteUsuario); //! NO CHECKED
router.post('/usuarios/reset-password', roleMiddleware(['gerente']), resetUsuarioPassword);  //! NO CHECKED

export default router;
