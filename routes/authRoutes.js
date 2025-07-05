const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware'); // middleware que validará el token


router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout); // logout requiere token válido

module.exports = router;
