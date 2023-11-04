// sesion.js (en tu carpeta de rutas)

const express = require('express');
const router = express.Router();
const Sesion = require('../../models/Sesion');

// Ruta para obtener el historial de sesión por ID de usuario
router.get('/historial/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Aquí debes implementar la lógica para obtener el historial de sesión por el ID de usuario
    const historial = await Sesion.findAll({
      where: { usuario_id: userId }, // Asume que tienes un campo 'usuario_id' en tu tabla de sesiones
      order: [['fecha_inicio_sesion', 'DESC']], // Opcional: ordena por fecha de inicio de sesión descendente
    });

    res.json(historial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



module.exports = router;
