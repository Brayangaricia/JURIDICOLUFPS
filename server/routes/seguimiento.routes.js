const express = require('express');
const router = express.Router();
const controller = require('../controllers/seguimiento.Controllers');

router.get('/', controller.seguimiento);

module.exports = router;