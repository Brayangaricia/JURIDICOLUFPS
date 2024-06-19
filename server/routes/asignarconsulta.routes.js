const express = require('express');
const router = express.Router();
const controller = require('../controllers/asignarconsulta.Controller');

router.get('/', controller.asignarconsulta);
router.get('/', controller.asignarConsultaAleatoria);

module.exports = router;