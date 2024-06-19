const express = require('express');
const router = express.Router();
const controller = require('../controllers/verusuario.Controller');

// Ruta para obtener usuarios
router.get('/', controller.obtenerUsuarios);

// Ruta para eliminar un usuario por ID
router.delete('/:id', controller.eliminarUsuario);

// Ruta para actualizar un usuario por ID
router.post('/:id', controller.actualizarUsuario);

// Ruta para obtener los datos de un usuario por ID y renderizar la vista de edición
router.get('/editar/:id', controller.obtenerUsuarioPorId);



module.exports = router;
