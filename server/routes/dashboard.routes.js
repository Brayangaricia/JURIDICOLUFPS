const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.Controller');

router.get('/', controller.dashboard);

module.exports = router;




