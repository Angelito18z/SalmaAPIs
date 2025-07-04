const pool = require('../db');

// Obtener todas las entregas (no eliminadas)
async function getAllEntregas(req, res) {
  try {
    const result = await pool.query('SELECT * FROM entregas WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching entregas:', error);
    res.status(500).json({ error: 'Error fetching entregas' });
  }
}

// Obtener una entrega por ID
async function getEntregaById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM entregas WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching entrega:', error);
    res.status(500).json({ error: 'Error fetching entrega' });
  }
}

// Crear una nueva entrega
async function createEntrega(req, res) {
  const { id_recorrido, id_punto_venta, fecha_entrega, entregado, observaciones } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO entregas (id_recorrido, id_punto_venta, fecha_entrega, entregado, observaciones)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_recorrido, id_punto_venta, fecha_entrega, entregado, observaciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating entrega:', error);
    res.status(500).json({ error: 'Error creating entrega' });
  }
}

// Actualizar entrega existente
async function updateEntrega(req, res) {
  const { id } = req.params;
  const { id_recorrido, id_punto_venta, fecha_entrega, entregado, observaciones } = req.body;
  try {
    const result = await pool.query(
      `UPDATE entregas
       SET id_recorrido = $1,
           id_punto_venta = $2,
           fecha_entrega = $3,
           entregado = $4,
           observaciones = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND deleted_at IS NULL
       RETURNING *`,
      [id_recorrido, id_punto_venta, fecha_entrega, entregado, observaciones, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating entrega:', error);
    res.status(500).json({ error: 'Error updating entrega' });
  }
}

// Borrado lógico de entrega
async function deleteEntrega(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE entregas
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega no encontrada o ya eliminada' });
    }
    res.json({ message: 'Entrega eliminada lógicamente' });
  } catch (error) {
    console.error('Error deleting entrega:', error);
    res.status(500).json({ error: 'Error deleting entrega' });
  }
}

module.exports = {
  getAllEntregas,
  getEntregaById,
  createEntrega,
  updateEntrega,
  deleteEntrega,
};
