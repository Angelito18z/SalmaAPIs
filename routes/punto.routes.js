const express = require('express');
const router = express.Router();
const puntoCtrl = require('../controllers/puntoVenta.controller');

router.get('/', puntoCtrl.getAllPuntos);

module.exports = router;
