const express = require('express');
const router = express.Router();
const controller = require('../controllers/verconsultadiaria.Controller');


router.get('/', controller.obtenerConsultadiaria);
router.put('/radicado/:id', controller.editarRadicado);
router.get('/pdf/:id', controller.obtenerPDFdiaria);


module.exports = router;

