// routes/proveedores.js
const express = require('express');
const router = express.Router();
const Proveedor = require('../../models/Proveedor'); // Asegúrate de usar la ruta correcta para tu modelo de proveedores

// Ruta para obtener todos los registros de proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



router.get('/lastInsertId', async (req, res) => {
  try {
    const lastInserted = await Proveedor.findOne({
      attributes: ['id'], // Obtener solo el ID
      order: [['id', 'DESC']] // Ordenar por ID en orden descendente
    });

    if (lastInserted) {
      res.json(lastInserted.id);
    } else {
      res.status(404).json({ error: 'No se encontró el último ID insertado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el último ID insertado' });
  }
});


router.post('/proveedorInsertar', async (req, res) => {
  const {
    nombreProveedor,
    telefono,
    email,
    direccion,
    ciudad
  } = req.body;

  try {
    // Utiliza el modelo Proveedor para crear un nuevo registro
    const nuevoProveedor = await Proveedor.create({
      nombreProveedor,
      telefono,
      email,
      direccion,
      ciudad
    });

    res.status(201).json({ 
      message: 'Proveedor insertado exitosamente.',
      id: nuevoProveedor.id  // Devuelve el ID del proveedor insertado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

router.get('/proveedor/:id', async (req, res) => {
  const proveedorId = req.params.id;

  try {
    const proveedor = await Proveedor.findByPk(proveedorId);
    if (!proveedor) {
      res.status(404).json({ message: 'Proveedor no encontrado.' });
    } else {
      res.json(proveedor);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para editar un registro de proveedor por su ID
router.put('/editarProveedor/:id', async (req, res) => {
    const proveedorId = req.params.id;
    const {
      nombreProveedor,
      telefono,
      email,
      direccion,
      ciudad,
 
    } = req.body;
  
    try {
      const result = await Proveedor.update(
        {
          nombreProveedor,
          telefono,
          email,
          direccion,
          ciudad,
 
        },
        { where: { id: proveedorId } }
      );
  
      if (result[0] === 1) {
        res.status(200).json({ message: 'Registro de proveedor actualizado exitosamente.' });
      } else {
        res.status(404).json({ message: 'Registro de proveedor no encontrado.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }
  });



  // Ruta para eliminar un registro de proveedor por su ID
router.delete('/eliminarProveedor/:id', async (req, res) => {
    const proveedorId = req.params.id;
  
    try {
      const result = await Proveedor.destroy({ where: { id: proveedorId } });
  
      if (result === 1) {
        res.status(200).json({ message: 'Registro de proveedor eliminado exitosamente.' });
      } else {
        res.status(404).json({ message: 'Registro de proveedor no encontrado.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }
  });
  
module.exports = router;
