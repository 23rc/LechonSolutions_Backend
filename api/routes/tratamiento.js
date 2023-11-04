const express = require('express');
const router = express.Router();
const Tratamiento = require('../../models/Tratamiento');

// Ruta para obtener todos los registros de tratamientos
router.get('/', async (req, res) => {
  try {
    const tratamientos = await Tratamiento.findAll();
    res.json(tratamientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener los tratamientos' });
  }
});



// Ruta para insertar un nuevo registro de Tratamiento
router.post('/tratamientoInsertar', async (req, res) => {
  const {
    numero_parto,
    id_cerda,
    cerda_nombre,
    fecha_aplicacion,
    producto,
    dosis,
    causa,
    id_info_parto
  } = req.body;

  try {
    await Tratamiento.create({
      numero_parto,
      id_cerda,
      cerda_nombre,
      fecha_aplicacion,
      producto,
      dosis,
      causa,
      id_info_parto
    });

    res.status(201).json({ message: 'Registro de Tratamiento insertado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para editar un registro de Tratamiento por su ID
router.put('/editarTratamiento/:id', async (req, res) => {
  const tratamientoId = req.params.id;
  const {
    fecha_aplicacion,
    producto,
    dosis,
    causa,
  } = req.body;

  try {
    const result = await Tratamiento.update(
      {
        fecha_aplicacion,
        producto,
        dosis,
        causa,
      },
      { where: { id: tratamientoId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ message: 'Registro de Tratamiento actualizado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro de Tratamiento no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});




router.delete('/tratamientoEliminar/:id', async (req, res) => {
  const tratamientoId = req.params.id;
  try {
    const tratamiento = await Tratamiento.findByPk(tratamientoId);
    if (!tratamiento) {
      return res.status(404).json({ message: 'Tratamiento no encontrado' });
    }
    await tratamiento.destroy();
    return res.status(200).json({ message: 'Tratamiento eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el tratamiento', error: error.message });
  }
});

module.exports = router;