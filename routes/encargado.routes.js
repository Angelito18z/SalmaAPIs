const express = require('express');
const router = express.Router();
const encargadoCtrl = require('../controllers/encargadoPV.controller');

router.get('/', encargadoCtrl.getAllEncargados);

module.exports = router;
