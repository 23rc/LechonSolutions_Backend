// routes/pacha.js
const express = require('express');
const router = express.Router();
const Pacha = require('../../models/Pacha'); // Reemplaza 'Pacha' con el nombre de tu modelo de Pacha

// Ruta para obtener todos los registros de Pacha
router.get('/', async (req, res) => {
  try {
    const pachas = await Pacha.findAll();
    res.json(pachas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para insertar un nuevo registro de Pacha
router.post('/pachaInsertar', async (req, res) => {
  const {
    nombre,
    fechaIngreso,
    fechaVencimiento,
    observacion,
    origenGenetico,
    lote,
    cantidad,
    calidad,
    temperaturaAlmacenamiento
  } = req.body;

  try {
    await Pacha.create({
      nombre,
      fechaIngreso,
      fechaVencimiento,
      observacion,
      origenGenetico,
      lote,
      cantidad,
      calidad,
      temperaturaAlmacenamiento
    });

    res.status(201).json({ message: 'Registro de Pacha insertado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para eliminar un registro de Pacha por su ID
router.delete('/pachaEliminar/:id', async (req, res) => {
  const pachaId = req.params.id;

  try {
    const result = await Pacha.destroy({ where: { id: pachaId } });

    if (result === 1) {
      res.status(200).json({ message: 'Registro de Pacha eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro de Pacha no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para editar un registro de Pacha por su ID
router.put('/editarPacha/:id', async (req, res) => {
  const pachaId = req.params.id;
  const {
    nombre,
    fechaIngreso,
    fechaVencimiento,
    observacion,
    origenGenetico,
    lote,
    cantidad,
    calidad,
    temperaturaAlmacenamiento
  } = req.body;

  try {
    const result = await Pacha.update(
      {
        nombre,
        fechaIngreso,
        fechaVencimiento,
        observacion,
        origenGenetico,
        lote,
        cantidad,
        calidad,
        temperaturaAlmacenamiento
      },
      { where: { id: pachaId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ message: 'Registro de Pacha actualizado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro de Pacha no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


module.exports = router;
