const express = require('express');
const router = express.Router();
const ControlCerda = require('../../models/ControlCerda'); // Asegúrate de importar el modelo Cerda
const Cerda = require('../../models/Cerda');
const Barraco = require('../../models/Barraco');
const Pacha = require('../../models/Pacha');
const Producto = require('../../models/Producto');
const InfoParto = require('../../models/InfoParto');


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('LechonSolutionsDB', 'root', 'workbench', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3308, // Puerto según el manejador o plataforma.
  //logging: false // Desactiva el registro de consultas
});
router.get('/', async (req, res) => {
    try {
      const controlCerdas = await ControlCerda.findAll();
      res.json(controlCerdas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }
  });


// Ruta para obtener todos los registros de ControlCerda con datos de Cerda y Barraco relacionados
// Ruta para obtener nombres e IDs de las cerdas
router.get('/cerdas', async (req, res) => {
  try {
    const cerdas = await Cerda.findAll({
      attributes: ['id', 'nombre'],
    });
    res.json(cerdas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
// Ruta para obtener nombres e IDs de los barracos
router.get('/barracos', async (req, res) => {
  try {
    const barracos = await Barraco.findAll({
      attributes: ['id', 'nombre'],
    });
    res.json(barracos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
router.get('/pachas', async (req, res) => {
  try {
    const pachas = await Pacha.findAll({
      attributes: ['id', 'nombre'],
    });
    res.json(pachas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


router.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      attributes: ['id', 'nombreProducto'],
      where: {
        tipoProducto: 'Pacha' // Filtro para obtener solo los productos con tipoProducto igual a 'Pacha'
      }
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
router.post('/controlcerdaInsertar', async (req, res) => {
  const {
    cerda_id,
    cerda_nombre,
    barraco_id,
    barraco_nombre,
    producto_id,
    producto_nombre,
    tipo_carga,
    fecha_inseminacion,
    fecha_confirmacion_carga,
    confirmar_carga,
    observaciones,

  } = req.body;

  
  try {
    if (producto_id) {
      const producto = await Producto.findByPk(producto_id);
      if (!producto) {
        return res.status(400).json({ error: 'Producto no encontrado.' });
      }
      
      if (producto.stock <= 0) {
        return res.status(400).json({ error: 'Producto agotado.' });
      }

      // Realiza la actualización del stock antes de crear el controlCerda
      await Producto.update(
        { stock: sequelize.literal('stock - 1') },
        { where: { id: producto_id } }
      );

      // Crea un nuevo registro en ControlCerda
      await ControlCerda.create({
        cerda_id,
        cerda_nombre,
        barraco_id,
        barraco_nombre,
        producto_id,
        producto_nombre,
        tipo_carga,
        fecha_inseminacion,
        fecha_confirmacion_carga,
        confirmar_carga,
        observaciones,
       
      });

      res.status(201).json({ message: 'Registro de ControlCerda insertado exitosamente.' });
    } else {
      const controlCerda = await ControlCerda.create({
        cerda_id,
        cerda_nombre,
        barraco_id,
        barraco_nombre,
        producto_id,
        producto_nombre,
        tipo_carga,
        fecha_inseminacion,
        fecha_confirmacion_carga,
        confirmar_carga,
        observaciones,

      });

      res.status(201).json({ message: 'Registro de ControlCerda insertado exitosamente.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


  // Ruta para eliminar un registro de ControlCerda por su ID
// Ruta para eliminar un registro de ControlCerda por su ID
router.delete('/controlcerdasEliminar/:id', async (req, res) => {
  const controlCerdaId = req.params.id;

  try {
    // Elimina los registros relacionados en info_parto
    await InfoParto.destroy({ where: { id_control_cerdaP: controlCerdaId } });

    // Luego, elimina el registro en control_cerda
    const result = await ControlCerda.destroy({ where: { id: controlCerdaId } });

    if (result === 1) {
      res.status(200).json({ message: 'Registro de ControlCerda eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro de ControlCerda no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para actualizar un registro de ControlCerda por su ID
// Ruta para actualizar un registro de ControlCerda por su ID
router.put('/controlcerdaEditar/:id', async (req, res) => {
  const controlCerdaId = req.params.id;
  const {
    cerda_id, 
    cerda_nombre, 
    barraco_id, 
    barraco_nombre, 
    producto_id,
    producto_nombre,
    tipo_carga, fecha_inseminacion, fecha_confirmacion_carga,confirmar_carga, observaciones
  } = req.body;

  try {
    // Obtener el registro actual de ControlCerda
    const controlCerdaActual = await ControlCerda.findByPk(controlCerdaId);

    if (!controlCerdaActual) {
      return res.status(404).json({ message: 'Registro de ControlCerda no encontrado.' });
    }

    // Verificar si el producto se modifica por un valor nulo
    if (producto_id === null || producto_id === undefined) {
      // No se realiza ninguna modificación adicional
    } else if (producto_id !== controlCerdaActual.producto_id) {
      // Verificar si el producto nuevo tiene existencia
      const productoNuevo = await Producto.findByPk(producto_id);

      if (!productoNuevo || productoNuevo.stock <= 0) {
        return res.status(400).json({ error: 'No hay suficiente stock disponible para el nuevo producto.' });
      }

      // Realizar la actualización de cantidades de stock
      await Producto.update(
        { stock: sequelize.literal('stock + 1') },
        { where: { id: controlCerdaActual.producto_id } }
      );
      await Producto.update(
        { stock: sequelize.literal('stock - 1') },
        { where: { id: producto_id } }
      );
    }

    // Actualizar el registro de ControlCerda
    const result = await ControlCerda.update(
      {
        cerda_id,
        cerda_nombre,
        barraco_id,
        barraco_nombre,
        producto_id,
        producto_nombre,
        tipo_carga,
        fecha_inseminacion,
        fecha_confirmacion_carga,
        confirmar_carga,
        observaciones,
      },
      { where: { id: controlCerdaId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ message: 'Registro de ControlCerda actualizado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro de ControlCerda no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});




router.get('/pendienteConfirmacion', async (req, res) => {
  try {
    const resultados = await ControlCerda.findAll({
      where: {
        confirmar_carga: 'No Cargada',
      },
    });

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

  module.exports = router;