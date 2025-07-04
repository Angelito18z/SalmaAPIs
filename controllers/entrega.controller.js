const pool = require('../db');

async function getAllEntregas(req, res) {
  try {
    const result = await pool.query('SELECT * FROM entregas WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching entregas:', error);
    res.status(500).json({ error: 'Error fetching entregas' });
  }
}

module.exports = {
  getAllEntregas,
};
