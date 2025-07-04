const pool = require('../db');

async function getAllEncargados(req, res) {
  try {
    const result = await pool.query('SELECT * FROM encargado_punto_venta WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching encargados:', error);
    res.status(500).json({ error: 'Error fetching encargados' });
  }
}

module.exports = {
  getAllEncargados,
};
