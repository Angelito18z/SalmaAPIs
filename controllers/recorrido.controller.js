const pool = require('../db');

// Obtener todos los recorridos
async function getAllRecorridos(req, res) {
  try {
    const result = await pool.query('SELECT * FROM recorridos WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recorridos:', error);
    res.status(500).json({ error: 'Error fetching recorridos' });
  }
}

// Obtener un recorrido por ID
async function getRecorridoById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM recorridos WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recorrido no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching recorrido:', error);
    res.status(500).json({ error: 'Error fetching recorrido' });
  }
}

// Crear un nuevo recorrido
async function createRecorrido(req, res) {
  const { id_repartidor, id_encargado_punto_venta, hora_fin } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO recorridos (id_repartidor, id_encargado_punto_venta, hora_fin)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_repartidor, id_encargado_punto_venta, hora_fin]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating recorrido:', error);
    res.status(500).json({ error: 'Error creating recorrido' });
  }
}



// Actualizar recorrido
async function updateRecorrido(req, res) {
  const { id } = req.params;
  const { id_repartidor, id_encargado_punto_venta, estado, fecha, hora_inicio, hora_fin } = req.body;
  try {
    const result = await pool.query(
      `UPDATE recorridos
       SET id_repartidor = $1,
           id_encargado_punto_venta = $2,
           estado = $3,
           fecha = $4,
           hora_inicio = $5,
           hora_fin = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND deleted_at IS NULL
       RETURNING *`,
      [id_repartidor, id_encargado_punto_venta, estado, fecha, hora_inicio, hora_fin, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recorrido no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating recorrido:', error);
    res.status(500).json({ error: 'Error updating recorrido' });
  }
}

// Eliminar recorrido (soft delete)
async function deleteRecorrido(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE recorridos
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recorrido no encontrado' });
    }
    res.json({ message: 'Recorrido eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting recorrido:', error);
    res.status(500).json({ error: 'Error deleting recorrido' });
  }
}

// Obtener recorridos mediante el id del encargado
async function getRecorridosPorEncargado(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT r.*, 
             u.nombre AS repartidor_nombre,
             u.apellido_paterno AS repartidor_apellido
      FROM recorridos r
      LEFT JOIN usuarios u ON u.id = r.id_repartidor
      WHERE r.id_encargado_punto_venta = $1 AND r.deleted_at IS NULL
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener recorridos por encargado:', err);
    res.status(500).json({ error: 'Error al obtener los recorridos' });
  }
}

module.exports = {
  getAllRecorridos,
  getRecorridoById,
  createRecorrido,
  updateRecorrido,
  deleteRecorrido,
  getRecorridosPorEncargado
};
