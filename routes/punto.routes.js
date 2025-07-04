const express = require('express');
const router = express.Router();
const puntoController = require('../controllers/puntoVenta.controller');


router.get('/', puntoController.getAllPuntos);
router.get('/:id', puntoController.getPuntoById);
router.post('/', puntoController.createPunto);
router.put('/:id', puntoController.updatePunto);
router.delete('/:id', puntoController.deletePunto);

module.exports = router;
