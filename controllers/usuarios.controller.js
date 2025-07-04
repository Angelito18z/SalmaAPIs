const db = require('../db');

const getUsuarios = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usuarios WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

module.exports = { getUsuarios };
