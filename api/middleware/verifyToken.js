const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carga las variables de entorno desde .env



// Middleware de verificación de tokens
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const secretKey = process.env.SECRET_KEY; // Accede a la clave secreta
    const decoded = jwt.verify(token, secretKey);

     // Establece req.user con los datos del usuario decodificados
     req.user = decoded;
    // Resto del código del middleware...
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = verifyToken;