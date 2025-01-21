import { Router } from 'express';
import { createPersonaCliente, filterClientes, getClientes, getClienteByRut, deleteClienteById, updateClienteByRut,getClienteById} from '../controllers/clienteController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.post(
    '/persona-cliente',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    createPersonaCliente); // Checked

// router.post(
//     '/cliente-con-persona',
//     roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
//     createClienteWithExistingPersona); 

router.get('/clientes',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClientes) // Checked

router.get('/rut-del-cliente/:rut',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClienteByRut) // Checked
router.get('/rut-cliente/:id',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClienteById)  // Checked

router.get('/clientes/filter', 
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    filterClientes); // Checked

router.put('/clientes/:rut',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    updateClienteByRut); // Cambiar de id a rut  //! NO Checked

router.delete('/clientes/:id',
    authMiddleware,
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    deleteClienteById); // 

export default router;
