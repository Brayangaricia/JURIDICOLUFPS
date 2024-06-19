const express = require('express');
const router = express.Router();
const controller = require('../controllers/verasignacion.Controller');

router.get('/', controller.verasignacion);

module.exports = router;