const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta';
const activeSessions = new Map();

// FUNCION DE LOGIN 
//********************************************************************************//
async function login(req, res) {
  const { correo, contrasenia } = req.body;

  try {
    const result = await pool.query(
      `SELECT u.*, r.rol AS nombre_rol
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id
       WHERE u.correo = $1 AND u.deleted_at IS NULL
       LIMIT 1`,
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña inválidos' });
    }

    const usuario = result.rows[0];

    const passwordValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña inválidos' });
    }

    if (activeSessions.has(usuario.id)) {
      return res.status(403).json({ error: 'Ya existe una sesión activa para este usuario' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: usuario.nombre_rol, // Usamos el nombre del rol
      },
      JWT_SECRET,
      { expiresIn: '5h' }
    );

    activeSessions.set(usuario.id, token);
    delete usuario.contrasenia;

    // Devolver el rol con nombre legible
    usuario.rol = usuario.nombre_rol;
    delete usuario.id_rol;
    delete usuario.nombre_rol;

    res.json({ message: 'Login exitoso', usuario, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
}



//FUNCION DE LOGOUT
//*******************************************************************+//
function logout(req, res) {
  const userId = req.user?.id;

  if (!userId || !activeSessions.has(userId)) {
    return res.status(400).json({ error: 'No hay sesión activa para cerrar' });
  }

  activeSessions.delete(userId);
  res.json({ message: 'Sesión cerrada exitosamente' });
}

module.exports = {
  login,
  logout,
  activeSessions, // exportar para usar en el middleware de autenticación
};
