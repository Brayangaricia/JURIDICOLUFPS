const express = require('express');
const router = express.Router();
const controller = require('../controllers/verseguimiento.Controller');

router.get('/', controller.verseguimiento);

module.exports = router;