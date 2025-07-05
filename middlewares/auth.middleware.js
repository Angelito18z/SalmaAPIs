const jwt = require('jsonwebtoken');
const { activeSessions } = require('../controllers/auth.controller');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verifica que el token esté activo
    if (!activeSessions.has(decoded.id) || activeSessions.get(decoded.id) !== token) {
      return res.status(401).json({ error: 'Sesión no válida o expirada' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = authenticate;
