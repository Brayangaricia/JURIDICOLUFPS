const express = require('express');
const router = express.Router();
const controller = require('../controllers/login.Controller');

router.get('/', controller.login);
router.post('/', controller.authenticateUser);



module.exports = router;