const express = require('express');
const router = express.Router();
const encargadoController = require('../controllers/encargadoPV.controller');

router.get('/', encargadoController.getAllEncargados);
router.get('/:id', encargadoController.getEncargadoById);
router.post('/', encargadoController.createEncargado);
router.put('/:id', encargadoController.updateEncargado);
router.delete('/:id', encargadoController.deleteEncargado);

module.exports = router;
