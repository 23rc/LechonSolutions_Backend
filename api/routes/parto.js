const express = require('express');
const router = express.Router();
const Parto = require('../../models/Parto'); // Asegúrate de que la ruta sea correcta según la ubicación de tu modelo de Parto
const ResumenParto = require('../../models/ResumenParto'); // Asegúrate de que la ruta sea correcta según la ubicación de tu modelo de Parto
const InfoParto = require('../../models/InfoParto'); // Asegúrate de que la ruta sea correcta según la ubicación de tu modelo de Parto
const Destete = require('../../models/Destete');
const { Op } = require('sequelize');


router.get('/', async (req, res) => {
  try {
    const partos = await Parto.findAll();
    res.json(partos);
  } catch (error) {
    console.error("Error al obtener datos de partos:", error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


router.get('/obtener-ultimo-parto', async (req, res) => {
  try {
    const cerdaId = req.query.cerdaId; // Obtiene el ID de la cerda desde la solicitud

    // Utiliza Sequelize para buscar el último parto de la cerda
    const ultimoParto = await Parto.findOne({
      where: { id_cerda: cerdaId },
      order: [['numero_parto', 'DESC']], // Ordena en orden descendente
      attributes: ['numero_parto'], // Solo necesitamos el número de parto
    });

    if (ultimoParto) {
      res.json(ultimoParto.numero_parto);
    } else {
      res.status(404).json({ error: 'No se encontró el último parto' });
    }
  } catch (error) {
    console.error('Error al obtener el último parto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




// Ruta para Eliminar un Registro de Parto por su ID
router.delete('/eliminarParto/:id', async (req, res) => {
  const partoId = req.params.id;

  try {
    // Busca el registro de parto por su ID
    const parto = await Parto.findByPk(partoId);

    if (!parto) {
      return res.status(404).json({ message: 'Registro de Parto no encontrado.' });
    }

    // Almacena el estado original del registro
    const estadoOriginal = parto.estado;
    
    const { id_cerda, numero_parto } = parto; // Guarda el id_cerda y numero_parto

    // Elimina el registro de parto
    const result = await Parto.destroy({ where: { id: partoId } });

    if (result === 1) {
      // Si se eliminó el registro, actualiza los valores en la tabla ResumenParto
      const resumenParto = await ResumenParto.findOne({
        where: { numero_parto, id_cerda }
      });

      if (resumenParto) {
        if (estadoOriginal === 'vivo') {
          resumenParto.nacidos_vivos--;
        } else if (estadoOriginal === 'muerto') {
          resumenParto.nacidos_muertos--;
        } else if (estadoOriginal === 'momia') {
          resumenParto.nacidos_momias--;
        }

        resumenParto.total = resumenParto.nacidos_vivos + resumenParto.nacidos_muertos + resumenParto.nacidos_momias;

        await resumenParto.save(); // Guarda los cambios en el resumen

        // También actualiza la tabla Destete para establecer "cantidad_destetar" a "total"
        const desteteRegistro = await Destete.findOne({
          where: { id_cerda, numero_parto }
        });

        if (desteteRegistro) {
          desteteRegistro.cantidad_destetar = resumenParto.total;
          await desteteRegistro.save();
        }
      }

      res.status(200).json({ message: 'Registro de Parto eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro de Parto no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para insertar un nuevo parto
router.post('/insertarParto', async (req, res) => {
  const {
    numero_parto,
    id_cerda,
    cerda_nombre,
    fecha,
    peso,
    m_h,
    estado,
    id_info_parto,
    hora_inicio,
    hora_final,
    atendidoPor,
    total, // Agrega la variable "total" para el número total de nacidos.
  } = req.body;

  try {
    // Verifica si el campo hora_final ya tiene un valor en la tabla "ResumenParto" para la misma cerda y número de parto.
    const existingResumenParto = await ResumenParto.findOne({
      where: { id_cerda, numero_parto, hora_final: { [Op.not]: null } }
    });

    if (existingResumenParto) {
      return res.status(400).json({ error: 'El proceso ya ha finalizado, no se permite una nueva inserción.' });
    }

    // Crear un nuevo registro en la tabla "Parto" sin verificar la existencia de datos
    const partoExistente = await Parto.create({
      numero_parto,
      id_cerda,
      cerda_nombre,
      fecha,
      peso,
      m_h,
      estado,
      id_info_parto
    });

    // Realiza la búsqueda en la tabla "ResumenParto" y maneja si no se encuentra un registro
    let resumenParto = await ResumenParto.findOne({
      where: { numero_parto, id_cerda }
    });

    if (resumenParto) {
      // Realiza las actualizaciones en el registro existente de "ResumenParto"
      if (estado === 'vivo') {
        resumenParto.nacidos_vivos++;
      } else if (estado === 'muerto') {
        resumenParto.nacidos_muertos++;
      } else if (estado === 'momia') {
        resumenParto.nacidos_momias++;
      }

      resumenParto.total = resumenParto.nacidos_vivos + resumenParto.nacidos_muertos + resumenParto.nacidos_momias;
      resumenParto.atendidoPor = atendidoPor;
      resumenParto.hora_inicio = hora_inicio;
      resumenParto.hora_final = hora_final;

      await resumenParto.save(); // Guarda los cambios en el registro de "ResumenParto"

      // Ahora, vamos a actualizar la tabla "Destete"
      // Primero, encuentra el registro correspondiente en "Destete"
      const desteteRegistro = await Destete.findOne({
        where: { id_cerda, numero_parto },
      });

      if (desteteRegistro) {
        // Actualiza el campo "cantidad_destetar" con el valor de "total" de "ResumenParto"
        desteteRegistro.cantidad_destetar = resumenParto.total;
        await desteteRegistro.save(); // Guarda los cambios en el registro de "Destete"
      }

    } else {
      // El registro de "ResumenParto" no existe, crea uno nuevo con valores iniciales
      await ResumenParto.create({
        atendidoPor: atendidoPor,
        numero_parto,
        id_cerda,
        cerda_nombre,
        nacidos_vivos: estado === 'vivo' ? 1 : 0,
        nacidos_muertos: estado === 'muerto' ? 1 : 0,
        nacidos_momias: estado === 'momia' ? 1 : 0,
        total: 1,
        hora_inicio,
        hora_final,
        id_info_parto
      });
    }

    res.status(201).json({
      message: 'Registro de Parto y ResumenParto creados y actualizados exitosamente',
      partoExistente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Hubo un error en el servidor al intentar crear y actualizar los registros.'
    });
  }
});


router.put('/editarParto/:id', async (req, res) => {
  const { fecha, peso, m_h, estado } = req.body;
  const { id } = req.params;

  try {
    // Busca el registro de parto por su ID para editarlo
    const parto = await Parto.findByPk(id);

    if (!parto) {
      return res.status(404).json({ error: 'Registro de parto no encontrado.' });
    }

    // Almacena el estado original antes de la edición
    const estadoOriginal = parto.estado;

    // Actualiza los campos del registro de parto
    parto.fecha = fecha;
    parto.peso = peso;
    parto.m_h = m_h;
    parto.estado = estado;

    await parto.save(); // Guarda los cambios

    // Verifica si se realizó un cambio en el estado y actualiza el resumen solo si cambió
    if (estadoOriginal !== estado) {
      const resumenParto = await ResumenParto.findOne({
        where: { numero_parto: parto.numero_parto, id_cerda: parto.id_cerda }
      });

      if (resumenParto) {
        // Actualiza el resumen de acuerdo al nuevo estado
        if (estadoOriginal === 'vivo') {
          resumenParto.nacidos_vivos--;
        } else if (estadoOriginal === 'muerto') {
          resumenParto.nacidos_muertos--;
        } else if (estadoOriginal === 'momia') {
          resumenParto.nacidos_momias--;
        }

        if (estado === 'vivo') {
          resumenParto.nacidos_vivos++;
        } else if (estado === 'muerto') {
          resumenParto.nacidos_muertos++;
        } else if (estado === 'momia') {
          resumenParto.nacidos_momias++;
        }

        resumenParto.total = resumenParto.nacidos_vivos + resumenParto.nacidos_muertos + resumenParto.nacidos_momias;

        await resumenParto.save(); // Guarda los cambios en el resumen
      }
    }

    res.status(200).json({
      message: 'Registro de Parto actualizado exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Hubo un error en el servidor al intentar actualizar el registro de parto.'
    });
  }
});
// Ruta para borrar la hora_final en ResumenParto por id_cerda y numero_parto
router.delete('/borrarHoraFinal', async (req, res) => {
  const { id_cerda, numero_parto } = req.body;

  try {
    const existingResumenParto = await ResumenParto.findOne({
      where: { id_cerda, numero_parto }
    });

    if (existingResumenParto) {
      existingResumenParto.hora_final = null; // Borra el contenido de hora_final
      await existingResumenParto.save(); // Guarda los cambios

      res.status(200).json({ message: 'Hora final eliminada exitosamente.' });
    } else {
      res.status(404).json({ message: 'El registro en ResumenParto no existe.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



module.exports = router;
