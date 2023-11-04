const express = require('express');
const router = express.Router();
const Barraco = require('../../models/Barraco'); // Reemplaza 'Barraco' con el nombre de tu modelo de barracos



// Ruta para obtener todos los barracos
router.get('/', async (req, res) => {
  try {
    const barraco = await Barraco.findAll();
    res.json(barraco);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para obtener un barraco por su ID
router.get('/barraco/:id', async (req, res) => {
  const barracoId = req.params.id;

  try {
    const barraco = await Barraco.findOne({ where: { id: barracoId } });

    if (barraco) {
      res.status(200).json(barraco);
    } else {
      res.status(404).json({ message: 'Barraco no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para insertar un barraco
router.post('/barracoInsertar', async (req, res) => {
  const { nombre, peso, fechaIngreso, observacion, altura, ubicacion, estadoSalud, temperatura, precio } = req.body;

  try {
    // Crea un nuevo barraco con todos los campos
    await Barraco.create({
      nombre,
      peso,
      fechaIngreso,
      observacion,
      altura,
      ubicacion,
      estadoSalud,
      temperatura,
      precio,
    });

    res.status(201).json({ message: 'Barraco insertado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para eliminar un barraco por su ID
router.delete('/barracoEliminar/:id', async (req, res) => {
  const barracoId = req.params.id;

  try {
    const result = await Barraco.destroy({ where: { id: barracoId } });

    if (result === 1) {
      res.status(200).json({ message: 'Barraco eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Barraco no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para editar un barraco por su ID
router.put('/editarBarraco/:id', async (req, res) => {
  const barracoId = req.params.id;
  const { nombre, peso, fechaIngreso, observacion, altura, ubicacion, estadoSalud, temperatura, precio } = req.body;

  try {
    const result = await Barraco.update(
      {
        nombre,
        peso,
        fechaIngreso,
        observacion,
        altura,
        ubicacion,
        estadoSalud,
        temperatura,
        precio
      },
      { where: { id: barracoId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ message: 'Barraco actualizado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Barraco no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



module.exports = router;