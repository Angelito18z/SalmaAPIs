const pool = require('../db');

// Obtener todos los puntos de venta (no eliminados)
async function getAllPuntos(req, res) {
  try {
    const result = await pool.query('SELECT * FROM punto_venta WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching puntos de venta:', error);
    res.status(500).json({ error: 'Error fetching puntos de venta' });
  }
}

// Obtener un punto de venta por ID
async function getPuntoById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM punto_venta WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Punto de venta no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching punto de venta:', error);
    res.status(500).json({ error: 'Error fetching punto de venta' });
  }
}

// Crear un nuevo punto de venta
async function createPunto(req, res) {
  const { direccion, nombre, latitud, longitud } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO punto_venta (direccion, nombre, latitud, longitud)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [direccion, nombre, latitud, longitud]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating punto de venta:', error);
    res.status(500).json({ error: 'Error creating punto de venta' });
  }
}

// Actualizar un punto de venta
async function updatePunto(req, res) {
  const { id } = req.params;
  const { direccion, nombre, latitud, longitud } = req.body;
  try {
    const result = await pool.query(
      `UPDATE punto_venta
       SET direccion = $1,
           nombre = $2,
           latitud = $3,
           longitud = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING *`,
      [direccion, nombre, latitud, longitud, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Punto de venta no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating punto de venta:', error);
    res.status(500).json({ error: 'Error updating punto de venta' });
  }
}

// Borrado lógico
async function deletePunto(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE punto_venta
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Punto de venta no encontrado o ya eliminado' });
    }
    res.json({ message: 'Punto de venta eliminado lógicamente' });
  } catch (error) {
    console.error('Error deleting punto de venta:', error);
    res.status(500).json({ error: 'Error deleting punto de venta' });
  }
}

module.exports = {
  getAllPuntos,
  getPuntoById,
  createPunto,
  updatePunto,
  deletePunto,
};
