const express = require('express');
const router = express.Router();
const Cliente = require('../../models/Cliente'); // Asegúrate de que la ruta sea correcta según la ubicación de tu modelo de Cliente

router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll(); // Cambiamos "Parto" por "Cliente" para recuperar datos de clientes
    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener datos de clientes:", error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
router.get('/cliente/:id', async (req, res) => {
    const clienteId = req.params.id;
  
    try {
      const cliente = await Cliente.findByPk(clienteId); // Supongamos que usas Sequelize para acceder a la base de datos
      if (!cliente) {
        res.status(404).json({ message: 'Cliente no encontrado.' });
      } else {
        res.json(cliente);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }
  });


  // Ruta para insertar un nuevo cliente
router.post('/clienteInsertar', async (req, res) => {
  const {
    nit,
    nombre,
    telefono,
    correo,
    direccion
  } = req.body;

  try {
    // Utiliza el modelo Cliente para crear un nuevo registro
    await Cliente.create({
      nit,
      nombre,
      telefono,
      correo,
      direccion
    });

    res.status(201).json({ message: 'Cliente insertado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para editar un Cliente por su ID
router.put('/clienteEditar/:id', async (req, res) => {
  const clienteId = req.params.id;

  try {
    const [rowsUpdated] = await Cliente.update(req.body, {
      where: { id: clienteId },
    });

    if (rowsUpdated === 1) {
      res.status(200).json({ message: 'Cliente actualizado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para eliminar un Cliente por su IDd
router.delete('/clienteEliminar/:id', async (req, res) => {
  const clienteId = req.params.id;

  try {
    const rowsDeleted = await Cliente.destroy({ where: { id: clienteId } });

    if (rowsDeleted === 1) {
      res.status(200).json({ message: 'Cliente eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

module.exports = router;
