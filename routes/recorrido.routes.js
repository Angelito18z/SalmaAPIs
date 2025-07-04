const express = require('express');
const router = express.Router();
const recorridoCtrl = require('../controllers/recorrido.controller');

router.get('/', recorridoCtrl.getAllRecorridos);

module.exports = router;
