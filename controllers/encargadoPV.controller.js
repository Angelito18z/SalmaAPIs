const pool = require('../db');

// Obtener todos los encargados (no eliminados)
async function getAllEncargados(req, res) {
  try {
    const result = await pool.query('SELECT * FROM encargado_punto_venta WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching encargados:', error);
    res.status(500).json({ error: 'Error fetching encargados' });
  }
}

// Obtener un encargado por ID
async function getEncargadoById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM encargado_punto_venta WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Encargado no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching encargado:', error);
    res.status(500).json({ error: 'Error fetching encargado' });
  }
}

// Crear un nuevo encargado
async function createEncargado(req, res) {
  const { nombre, apellido_paterno, apellido_materno, telefono } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO encargado_punto_venta (nombre, apellido_paterno, apellido_materno, telefono)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, telefono]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating encargado:', error);
    res.status(500).json({ error: 'Error creating encargado' });
  }
}

// Actualizar un encargado existente
async function updateEncargado(req, res) {
  const { id } = req.params;
  const { nombre, apellido_paterno, apellido_materno, telefono } = req.body;
  try {
    const result = await pool.query(
      `UPDATE encargado_punto_venta
       SET nombre = $1,
           apellido_paterno = $2,
           apellido_materno = $3,
           telefono = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, telefono, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Encargado no encontrado o eliminado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating encargado:', error);
    res.status(500).json({ error: 'Error updating encargado' });
  }
}

// Borrado lógico de un encargado
async function deleteEncargado(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE encargado_punto_venta
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Encargado no encontrado o ya eliminado' });
    }
    res.json({ message: 'Encargado eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting encargado:', error);
    res.status(500).json({ error: 'Error deleting encargado' });
  }
}

module.exports = {
  getAllEncargados,
  getEncargadoById,
  createEncargado,
  updateEncargado,
  deleteEncargado,
};
