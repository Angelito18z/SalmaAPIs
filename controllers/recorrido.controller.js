const pool = require('../db');

async function getAllRecorridos(req, res) {
  try {
    const result = await pool.query('SELECT * FROM recorridos WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recorridos:', error);
    res.status(500).json({ error: 'Error fetching recorridos' });
  }
}

module.exports = {
  getAllRecorridos,
};
