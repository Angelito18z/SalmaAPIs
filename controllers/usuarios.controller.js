const db = require('../db');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id,
        u.correo,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.telefono,
        u.numero_identificacion,
        r.rol AS rol,
        u.created_at,
        u.updated_at
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id
      WHERE u.deleted_at IS NULL
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT 
        u.id,
        u.correo,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.telefono,
        u.numero_identificacion,
        r.rol AS rol,
        u.created_at,
        u.updated_at
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id
      WHERE u.id = $1 AND u.deleted_at IS NULL
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

const createUsuario = async (req, res) => {
  const {
    correo,
    contrasenia,
    nombre,
    apellido_paterno,
    apellido_materno,
    telefono,
    numero_identificacion,
    id_rol
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasenia, 10); // 10 salt rounds

    const result = await db.query(
      `INSERT INTO usuarios (
        correo, contrasenia, nombre, apellido_paterno, apellido_materno,
        telefono, numero_identificacion, id_rol
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        correo,
        hashedPassword,
        nombre,
        apellido_paterno,
        apellido_materno,
        telefono,
        numero_identificacion,
        id_rol
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { correo, contrasenia, nombre, apellido_paterno, apellido_materno, id_rol } = req.body;
  try {
    let hashedPassword = contrasenia;
    
    if (contrasenia) {
      hashedPassword = await bcrypt.hash(contrasenia, 10);
    }

    const result = await db.query(
      `UPDATE usuarios
       SET correo = $1,
           contrasenia = $2,
           nombre = $3,
           apellido_paterno = $4,
           apellido_materno = $5,
           id_rol = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND deleted_at IS NULL
       RETURNING *`,
      [correo, hashedPassword, nombre, apellido_paterno, apellido_materno, id_rol, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o eliminado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};


// Eliminar (borrado lógico) un usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `UPDATE usuarios
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o ya eliminado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};


module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
