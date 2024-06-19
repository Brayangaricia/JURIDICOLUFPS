const express = require('express');
const router = express.Router();
const controller = require('../controllers/verconsulta.Controller');


router.get('/', controller.obtenerConsulta);
router.post('/', controller.generarRadicado);
router.get('/pdf/:id', controller.obtenerPDF);


module.exports = router;