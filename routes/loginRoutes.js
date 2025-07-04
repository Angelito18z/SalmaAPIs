const express = require('express');
const router = express.Router();
const loginController = require('../controllers/usuarioLogin.controller');

router.post('/', loginController.login);

module.exports = router;
