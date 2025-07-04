const express = require('express');
const router = express.Router();

const encargadoRoutes = require('./encargado.routes');
const entregaRoutes = require('./entrega.routes');
const puntoRoutes = require('./punto.routes');
const recorridoRoutes = require('./recorrido.routes');
const usuarioRoutes = require('./usuarios.routes');

router.use('/encargados', encargadoRoutes);
router.use('/entregas', entregaRoutes);
router.use('/puntos', puntoRoutes);
router.use('/recorridos', recorridoRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;
