const express = require('express');
const router = express.Router();
const controller = require('../controllers/pacientes.controller');

router.get('/', controller.listar);
router.get('/buscar', controller.buscar);
router.get('/resumen', controller.resumen);
router.post('/', controller.registrar);

module.exports = router;
