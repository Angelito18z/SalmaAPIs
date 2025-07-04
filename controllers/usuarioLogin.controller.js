const pool = require('../db');

async function login(req, res) {
  const { correo, contrasenia } = req.body;

  try {
    const query = `
      SELECT id, correo, nombre, apellido_paterno, apellido_materno, id_rol
      FROM usuarios
      WHERE correo = $1
        AND contrasenia = crypt($2, contrasenia)
        AND deleted_at IS NULL
      LIMIT 1
    `;

    const result = await pool.query(query, [correo, contrasenia]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    res.json({ message: 'Login exitoso', user });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
}

module.exports = { login };
