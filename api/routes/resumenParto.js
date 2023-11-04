const express = require('express');
const router = express.Router();
const ResumenParto = require('../../models/ResumenParto'); // Asegúrate de importar el modelo ResumenParto

// Ruta para obtener todos los registros de resumen_parto
router.get('/', async (req, res) => {
  try {
    const resumenPartoData = await ResumenParto.findAll();
    res.json(resumenPartoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


router.delete('/resumenPartoEliminar/:id', async (req, res) => {
  const resumenPartoId = req.params.id;
  try {
    const resumenParto = await ResumenParto.findByPk(resumenPartoId);
    if (!resumenParto) {
      return res.status(404).json({ message: 'Resumen de Parto no encontrado' });
    }

    await resumenParto.destroy();
    return res.status(200).json({ message: 'Resumen de Parto eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el Resumen de Parto', error: error.message });
  }
});

module.exports = router;
