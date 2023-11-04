const express = require('express');
const router = express.Router();
const Destete = require('../../models/Destete'); // Asegúrate de importar el modelo Destete

// Ruta para obtener todos los registros de Destete
router.get('/', async (req, res) => {
    try {
      const desteteData = await Destete.findAll();
      res.json(desteteData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }
  });

  // Ruta para obtener todos los registros de control_parto
router.get('/control', async (req, res) => {
  try {
    const controlPartos = await ControlParto.findAll();
    res.json(controlPartos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


  router.delete('/eliminarDestete/:id', async (req, res) => {
    const desteteId = req.params.id;
  
    try {
      const destete = await Destete.findByPk(desteteId);
  
      if (!destete) {
        // Si no se encuentra el registro, devolvemos un error 404
        return res.status(404).json({ error: 'Registro no encontrado.' });
      }
  
      // Eliminamos el registro de Destete
      await destete.destroy();
  
      res.json({ mensaje: 'Registro eliminado exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }
  });
module.exports = router;
