import { Router } from 'express';
import { 
        createPersona, 
        updatePersona, 
        getAllPersonas, 
        getPersonaById, 
        searchPersonas, 
        countPersonas, 
        deletePersona 
    } from '../controllers/personaController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware)

router.post('/crear-persona', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), createPersona); // Checkes
router.put('/actualizar-persona/:id', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), updatePersona); // Checked
router.get('/mostrar-personas', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getAllPersonas); // Checkes
router.delete('/eliminar-persona/:id', roleMiddleware(['gerente', 'jefe_administrativo']), deletePersona); // Checked
router.get('/buscarpersonas-criterios', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), searchPersonas); // Cheked
router.get('/contar-personas', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), countPersonas); // Checked
router.get('/buscar-persona/:id', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getPersonaById); // Checkedc

export default router;
