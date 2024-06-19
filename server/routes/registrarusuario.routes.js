const express = require('express');
const router = express.Router();
const controller = require('../controllers/registrarusuario.Controller');

router.get('/', controller.registrarusuario)
router.post('/', controller.registrarusuariopost)




module.exports = router;
