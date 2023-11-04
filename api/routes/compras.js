const express = require('express');
const router = express.Router();
const Compras = require('../../models/Compras'); // Asegúrate de importar el modelo correcto
const sequelize = require('../../config/sequelize'); // Asegúrate de ajustar la ruta según la configuración de tu proyecto


// Ruta para obtener todas las compras
router.get('/', async (req, res) => {
    try {
      const compras = await Compras.findAll();
      res.json(compras);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al obtener las compras. Por favor, inténtalo de nuevo más tarde.' });
    }
  });

// Ruta para insertar una nueva compra
router.post('/insertarCompras', async (req, res) => {
  try {
    // Obtén los datos de la compra desde el cuerpo de la solicitud
    const { nombreProducto, cantidad_vendida, precio_unitario, total, IDProveedor, IDProducto, fecha } = req.body;

    // Inserta una nueva compra en la base de datos
    const nuevaCompra = await Compras.create({
      nombreProducto,
      cantidad_vendida,
      precio_unitario,
      total,
      IDProveedor,
      IDProducto,
      fecha
    });

    res.status(201).json({ message: 'Compra registrada con éxito', compra: nuevaCompra });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al registrar la compra' });
  }
});

// Ruta para editar el precio_unitario de una compra por su ID
router.put('/editarPrecioUnitario/:id', async (req, res) => {
  const compraId = req.params.id;
  const { precio_unitario } = req.body;

  try {
    const result = await Compras.update(
      { precio_unitario },
      { where: { id: compraId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ mensaje: 'Precio_unitario actualizado exitosamente' });
    } else {
      res.status(404).json({ mensaje: 'Compra no encontrada o ningún cambio realizado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Hubo un error en el servidor al actualizar el precio_unitario' });
  }
});

// Ruta para eliminar una compra por su ID
router.delete('/eliminarCompra/:id', async (req, res) => {
  const compraId = req.params.id;

  try {
    // Busca la compra por su ID y elimínala
    const result = await Compras.destroy({ where: { id: compraId } });

    if (result === 1) {
      res.status(200).json({ mensaje: 'Compra eliminada exitosamente' });
    } else {
      res.status(404).json({ mensaje: 'Compra no encontrada o ningún cambio realizado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Hubo un error en el servidor al eliminar la compra' });
  }
});


router.get('/compras-mensuales', async (req, res) => {
  try {
    // Realiza una consulta en tu base de datos para obtener los datos requeridos
    // Reemplaza esto con tu consulta SQL real
    const monthlyData = await Compras.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('fecha')), 'month'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total'],
      ],
      group: [sequelize.fn('MONTH', sequelize.col('fecha'))],
      order: [[sequelize.fn('MONTH', sequelize.col('fecha')), 'ASC']],
    });

    res.json(monthlyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos de compras mensuales' });
  }
});
module.exports = router;
