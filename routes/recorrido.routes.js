const express = require('express');
const router = express.Router();
const recorridoController = require('../controllers/recorrido.controller');

router.get('/', recorridoController.getAllRecorridos);
router.get('/:id', recorridoController.getRecorridoById);
router.post('/', recorridoController.createRecorrido);
router.put('/:id', recorridoController.updateRecorrido);
router.delete('/:id', recorridoController.deleteRecorrido);

module.exports = router;
