import { Router } from "express";

import {createComuna,
        updateComuna, 
        getAllComunas, 
        getComunaById}
    from "../controllers/comunaController"

import { authMiddleware, roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();    

// ! Eliminar JEFE ADMINISTRATIVO
router.get('/mostrar-comunas', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo','administrativo']), getAllComunas); // Checked
router.post('/crear-comuna', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), createComuna); //! NO CHECKED
router.get('/mostrar-comuna/:id', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), getComunaById); // Checked
router.put('/actualizar-comuna/:id', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), updateComuna); //! NO CHECKED

export default router;
