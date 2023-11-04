const express = require('express');
const router = express.Router();
const Ventas = require('../../models/Ventas'); // Asegúrate de importar el modelo correcto
const sequelize = require('../../config/sequelize'); // Asegúrate de ajustar la ruta según la configuración de tu proyecto

// Ruta para obtener todas las ventas
router.get('/', async (req, res) => {
    try {
      const ventas = await Ventas.findAll();
      res.json(ventas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al obtener las ventas. Por favor, inténtalo de nuevo más tarde.' });
    }
  });
  
// Ruta para insertar una nueva venta
router.post('/insertarVentas', async (req, res) => {
    try {
      // Obtén los datos de la venta desde el cuerpo de la solicitud
      const { codigo_camada, cantidad_vendida, precio_unitario, total, IDCliente, IDCamada, fecha } = req.body;
  
      // Inserta una nueva venta en la base de datos
      const nuevaVenta = await Ventas.create({
        codigo_camada,
        cantidad_vendida,
        precio_unitario,
        total,
        IDCliente,
        IDCamada,
        fecha
      });
  
      res.status(201).json({ message: 'Venta registrada con éxito', venta: nuevaVenta });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al registrar la venta' });
    }
  });

// Ruta para editar el precio_unitario de una venta por su ID
// Ruta para editar el precio_unitario de una venta por su ID
router.put('/editarPrecioUnitario/:id', async (req, res) => {
    const ventaId = req.params.id;
    const { precio_unidad } = req.body;
  
    try {
      const result = await Ventas.update(
        { precio_unitario: precio_unidad },
        { where: { id: ventaId } }
      );
  
      if (result[0] === 1) {
        res.status(200).json({ mensaje: 'Precio_unitario actualizado exitosamente' });
      } else {
        res.status(404).json({ mensaje: 'Venta no encontrada o ningún cambio realizado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Hubo un error en el servidor al actualizar el precio_unitario' });
    }
  });
  
  
  // Otras rutas y lógica relacionada con las ventas
  
  
  // Otras rutas y lógica relacionada con las ventas
  router.delete('/eliminarVenta/:id', async (req, res) => {
    const ventaId = req.params.id;
  
    try {
      // Busca la venta por su ID y elimínala
      const result = await Ventas.destroy({ where: { id: ventaId } });
  
      if (result === 1) {
        res.status(200).json({ mensaje: 'Venta eliminada exitosamente' });
      } else {
        res.status(404).json({ mensaje: 'Venta no encontrada o ningún cambio realizado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Hubo un error en el servidor al eliminar la venta' });
    }
  });



  router.get('/ventas-mensuales', async (req, res) => {
    try {
      // Realiza una consulta en tu base de datos para obtener los datos requeridos
      // Reemplaza esto con tu consulta SQL real
      const monthlyData = await Ventas.findAll({
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
      res.status(500).json({ message: 'Error al obtener los datos de ventas mensuales' });
    }
  });

module.exports = router;
