const express = require('express');
const router = express.Router();
const Temperatura = require('../../models/Temperatura');

// Ruta para obtener todos los registros de temperatura
router.get('/', async (req, res) => {
  try {
    const temperaturas = await Temperatura.findAll();
    res.json(temperaturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para eliminar un registro de tratamiento
router.delete('/eliminarTemperatura/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Encuentra el registro de tratamiento por ID
    const temperatura = await Temperatura.findByPk(id);

    if (!temperatura) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }

    // Elimina el registro de tratamiento de la base de datos
    await temperatura.destroy();

    res.json({ message: 'Tratamiento eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
// Ruta para editar un registro de Temperatura por su ID
router.put('/editarTemperatura/:id', async (req, res) => {
  const temperaturaId = req.params.id;
  const {

    fechaT,
    temperaturaT,
    horaT,
    observacionT,
 
  } = req.body;

  try {
    const result = await Temperatura.update(
      {
 
        fechaT,
        temperaturaT,
        horaT,
        observacionT,
      },
      { where: { id: temperaturaId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ message: 'Registro de Temperatura actualizado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro de Temperatura no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



// Ruta para insertar un nuevo registro de Temperatura
router.post('/insertarTemperatura', async (req, res) => {
  const {
    numero_partoT,
    id_cerdaT,
    cerda_nombreT,
    fechaT,
    temperaturaT,
    horaT,
    observacionT,
    id_info_partoT
  } = req.body;

  try {
    const nuevoRegistroTemperatura = await Temperatura.create({
      numero_partoT,
      id_cerdaT,
      cerda_nombreT,
      fechaT,
      temperaturaT,
      horaT,
      observacionT,
      id_info_partoT
    });

    res.status(201).json({ message: 'Registro de Temperatura creado exitosamente', nuevoRegistroTemperatura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor al intentar crear el registro de Temperatura.' });
  }
});
module.exports = router;
