const express = require('express');
const router = express.Router();
const Cerda = require('../../models/Cerda'); // Asegúrate de importar el modelo Cerda


// Ruta para obtener todas las cerdas
router.get('/', async (req, res) => {
  try {
    const cerdas = await Cerda.findAll();
    res.json(cerdas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para insertar una nueva cerda
// Ruta para insertar una cerda
router.post('/cerdaInsertar', async (req, res) => {
  const { nombre, tetas, peso, fechaIngreso, observacion, altura, ubicacion, estadoSalud, temperatura, ultimaActualizacion } = req.body;

  try {
    await Cerda.create({ nombre, tetas, peso, fechaIngreso, observacion, altura, ubicacion, estadoSalud, temperatura, ultimaActualizacion });
    res.status(201).json({ message: 'Cerda insertada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para eliminar una cerda por su ID
router.delete('/cerdaEliminar/:id', async (req, res) => {
  const cerdaId = req.params.id;

  try {
    const result = await Cerda.destroy({ where: { id: cerdaId } });

    if (result === 1) {
      res.status(200).json({ message: 'Cerda eliminada exitosamente.' });
    } else {
      res.status(404).json({ message: 'Cerda no encontrada.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para editar una cerda por su ID
router.put('/editarCerda/:id', async (req, res) => {
  const cerdaId = req.params.id;
  const { nombre, tetas, peso, fechaIngreso, observacion, altura, ubicacion, estadoSalud, temperatura, ultimaActualizacion } = req.body;

  try {
    const result = await Cerda.update(
      { nombre, tetas, peso, fechaIngreso, observacion, altura, ubicacion, estadoSalud, temperatura, ultimaActualizacion },
      { where: { id: cerdaId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ message: 'Cerda actualizada exitosamente.' });
    } else {
      res.status(404).json({ message: 'Cerda no encontrada.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


module.exports = router;
