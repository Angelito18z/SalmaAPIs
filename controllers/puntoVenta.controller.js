const pool = require('../db');

async function getAllPuntos(req, res) {
  try {
    const result = await pool.query('SELECT * FROM punto_venta WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching puntos de venta:', error);
    res.status(500).json({ error: 'Error fetching puntos de venta' });
  }
}

module.exports = {
  getAllPuntos,
};
