const express = require('express');
const router = express.Router();

const encargadoRoutes = require('./encargado.routes');
const entregaRoutes = require('./entrega.routes');
const puntoRoutes = require('./punto.routes');
const recorridoRoutes = require('./recorrido.routes');
const usuarioRoutes = require('./usuarios.routes');
const loginRoutes = require('./authRoutes');

router.use('/encargados', encargadoRoutes);
router.use('/entregas', entregaRoutes);
router.use('/puntos', puntoRoutes);
router.use('/recorridos', recorridoRoutes);
router.use('/usuarios', usuarioRoutes);

router.use('/auth', loginRoutes);

module.exports = router;
