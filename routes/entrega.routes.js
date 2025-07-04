const express = require('express');
const router = express.Router();
const entregaCtrl = require('../controllers/entrega.controller');

router.get('/', entregaCtrl.getAllEntregas);

module.exports = router;
