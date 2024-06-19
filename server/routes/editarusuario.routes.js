const express = require('express');
const router = express.Router();
const controller = require('../controllers/editarusuario.Controller');

// Ruta para obtener usuarios
router.get('/', controller.editarusuario);



module.exports = router;


