import express from 'express';
import * as controller from '../controllers/pacientes.controller.js';

const router = express.Router();

router.get('/', controller.listar);
router.get('/buscar', controller.buscar);
router.get('/resumen', controller.resumen);
router.post('/', controller.registrar);

export default router;
