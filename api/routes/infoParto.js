const express = require('express');
const router = express.Router();
const InfoParto = require('../../models/InfoParto'); // Reemplaza 'Barraco' con el nombre de tu modelo de barracos
const Destete = require('../../models/Destete');
const Cerda = require('../../models/Cerda');
const Partos = require('../../models/Parto');
const ResumenParto = require('../../models/ResumenParto');
const Temperatura = require('../../models/Temperatura');
const Tratamiento = require('../../models/Tratamiento');

const moment = require('moment');


// Ruta para mostrar todos los registros de InfoParto
router.get('/', async (req, res) => {
  try {
    const infoPartos = await InfoParto.findAll();
    res.json(infoPartos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos de InfoParto' });
  }
});
router.delete('/eliminarInfoParto/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Paso 1: Eliminar registros en la tabla Partos relacionados con InfoParto
    await Partos.destroy({
      where: { id_info_parto: id }
    });

    // Paso 2: Eliminar registros en la tabla Temperatura relacionados con InfoParto
    await Temperatura.destroy({
      where: { id_info_partoT: id }
    });
   
    // Paso 3: Eliminar registros en la tabla Tratamiento relacionados con InfoParto
    await Tratamiento.destroy({
      where: { id_info_parto: id }
    });

    // Paso 4: Eliminar registros en la tabla ResumenParto relacionados con InfoParto
    await ResumenParto.destroy({
      where: { id_info_parto: id }
    });

    // Paso 5: Eliminar el registro en la tabla InfoParto
    const infoParto = await InfoParto.findByPk(id);
    if (!infoParto) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    await infoParto.destroy();

    res.json({ message: 'Registro de InfoParto eliminado correctamente junto con sus registros relacionados en Partos, Temperatura, Tratamiento y ResumenParto' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el registro de InfoParto y sus registros relacionados' });
  }
});

router.get('/info-parto/:idCerda/:numeroParto', async (req, res) => {
  try {
    const idCerda = req.params.idCerda;
    const numeroParto = req.params.numeroParto;

    // Busca los datos de InfoParto basados en id_cerda y número de parto
    const infoPartoData = await InfoParto.findOne({
      where: { id_cerdaP: idCerda, numero_partoP: numeroParto },
    });

    if (infoPartoData) {
      res.json(infoPartoData);
    } else {
      res.json({ message: 'No se encontraron datos de InfoParto para la cerda y número de parto proporcionados.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


router.get('/obtener-ultimo-parto-info', async (req, res) => {
  try {
    const cerdaId = req.query.cerdaId; // Obtiene el ID de la cerda desde la solicitud

    // Utiliza Sequelize para buscar el último parto de la cerda en la tabla info_parto
    const ultimoPartoInfo = await InfoParto.findOne({
      where: { id_cerdaP: cerdaId },
      order: [['numero_partoP', 'DESC']], // Ordena en orden descendente
      attributes: ['numero_partoP'], // Solo necesitamos el número de parto
    });

    if (ultimoPartoInfo) {
      res.json(ultimoPartoInfo.numero_partoP);
    } else {
      res.status(404).json({ error: 'No se encontró el último parto en info_parto' });
    }
  } catch (error) {
    console.error('Error al obtener el último parto de info_parto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



router.get('/info-parto/:idCerda', async (req, res) => {
  try {
    const idCerda = req.params.idCerda;

    // Busca los datos de InfoParto basados en id_cerdaP
    const infoPartoData = await InfoParto.findOne({
      where: { id_cerdaP: idCerda },
      order: [['numero_partoP', 'DESC']], // Ordena por número de parto de manera descendente para obtener el último
    });

    // Busca los datos de la Cerda basados en el mismo id_cerdaP
    const cerdaData = await Cerda.findOne({
      where: { id: idCerda },
      attributes: ['peso', 'tetas'],
    });

    // Comprueba si se encontraron datos de InfoParto
    if (infoPartoData) {
      // Si se encontraron datos de InfoParto, agrega los campos de peso y tetas de la Cerda
      infoPartoData.dataValues.peso = cerdaData.peso;
      infoPartoData.dataValues.tetas = cerdaData.tetas;
      res.json(infoPartoData);
    } else {
      // Si no se encontraron datos de InfoParto, envía un objeto con valores nulos
      res.json({
        id: null,
        id_cerdaP: null,
        numero_partoP: null,
        atendidoPor: null,
        pesoFinal: null,
        perdidaPeso: null,
        // Agrega más campos con valores nulos según la estructura de tu modelo InfoParto
        peso: cerdaData ? cerdaData.peso : null,
        tetas: cerdaData ? cerdaData.tetas : null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});




router.get('/', async (req, res) => {
    try {
      const registros = await InfoParto.findAll(); // Recupera todos los registros de la tabla
  
      res.json(registros);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al obtener los registros' });
    }
  });
  
  router.get('/verificar', async (req, res) => {
    const idCerda = req.query.cerdaId; // Obtener el ID de la cerda de la solicitud
    const numeroParto = req.query.numeroParto; // Obtener el número de parto de la solicitud
  
    try {
      const resultado = await InfoParto.findOne({
        where: {
          id_cerdaP: idCerda,
          numero_partoP: numeroParto
        }
      });
  
      res.json(!!resultado); // Devuelve true si se encuentra una entrada que cumple con las condiciones, o false en caso contrario
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al verificar el número de parto' });
    }
  });

  router.post('/infoPartoInsertar', async (req, res) => {
    try {
      // Obtener datos del cuerpo de la solicitud
      const {
        id_control_cerdaP,
        id_cerdaP,
        numero_partoP,
        cerda_nombreP,
        fecha_posible_partoP,
        tetasP,
        tipo_cargaP,
        nombre_barracoP,
        pacha_nombreP,
        pesoP,
        pesoFinalP,
        perdidaPesoP,
        atendidoPor,
      } = req.body;
  
      // Verificar si un registro con el mismo número de parto ya existe en la tabla InfoParto
      let registroExistenteInfoParto = await InfoParto.findOne({
        where: { numero_partoP },
      });
  
      // Inicializar una variable para realizar un seguimiento del registro de Destete
      let registroDestete;
  
      if (registroExistenteInfoParto) {
        // Si el registro existe en InfoParto, actualiza sus datos
        registroExistenteInfoParto = await InfoParto.update(
          {
            id_control_cerdaP,
            id_cerdaP,
            numero_partoP,
            cerda_nombreP,
            fecha_posible_partoP,
            tetasP,
            tipo_cargaP,
            nombre_barracoP,
            pacha_nombreP,
            pesoP,
            pesoFinalP,
            perdidaPesoP,
            atendidoPor,
          },
          { where: { numero_partoP } }
        );
  
        // Verificar si el registro existe en la tabla Destete
        registroDestete = await Destete.findOne({
          where: { id_cerda: id_cerdaP, numero_parto: numero_partoP },
        });
      } else {
        // Si no existe un registro en InfoParto, crea uno con los datos proporcionados
        registroExistenteInfoParto = await InfoParto.create({
          id_control_cerdaP,
          id_cerdaP,
          numero_partoP,
          cerda_nombreP,
          fecha_posible_partoP,
          tetasP,
          tipo_cargaP,
          nombre_barracoP,
          pacha_nombreP,
          pesoP,
          pesoFinalP,
          perdidaPesoP,
          atendidoPor,
        });
  
        // El registro en InfoParto se creó, por lo que no existe en Destete
        registroDestete = null;
      }
  
      // Obtener la fecha actual
      const fechaActual = new Date();
  
      // Calcular la fecha de destete (22 días después de la fecha actual)
      const fechaDestete = new Date(fechaActual);
      fechaDestete.setDate(fechaDestete.getDate() + 22);
  
      if (registroDestete) {
        // Si el registro existe en la tabla Destete, actualiza sus datos
        await Destete.update(
          {
            numero_parto: numero_partoP,
            id_cerda: id_cerdaP,
            cerda_nombre: cerda_nombreP,
            tipo_carga: tipo_cargaP,
            barraco_nombre: nombre_barracoP,
            pacha_nombre: pacha_nombreP,
            fecha_parto: fechaActual,
            fecha_destete: fechaDestete,
            atendidoPor: atendidoPor,
            estado: "No cargado",
            id_info_parto: registroExistenteInfoParto.id,
            // Agregar los campos adicionales y sus valores aquí
          },
          { where: { id_cerda: id_cerdaP, numero_parto: numero_partoP } }
        );
      } else {
        // Si no existe un registro en la tabla Destete, crea uno con los datos correspondientes
        await Destete.create({
          numero_parto: numero_partoP,
          id_cerda: id_cerdaP,
          cerda_nombre: cerda_nombreP,
          tipo_carga: tipo_cargaP,
          barraco_nombre: nombre_barracoP,
          pacha_nombre: pacha_nombreP,
          fecha_parto: fechaActual,
          fecha_destete: fechaDestete,
          atendidoPor: atendidoPor,
          estado: "No cargado",
          id_info_parto: registroExistenteInfoParto.id,
          // Agregar los campos adicionales y sus valores aquí
        });
      }
  
      return res.status(201).json({ mensaje: 'Registros insertados o actualizados exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al insertar o actualizar los registros' });
    }
  });
  
  
  

  // Ruta para modificar un registro existente en info_parto
router.put('/infoPartoEditar/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
  
      // Busca el registro en la base de datos por su ID y actualiza los datos
      const [numActualizados] = await InfoParto.update(datosActualizados, {
        where: { id },
      });
  
      if (numActualizados > 0) {
        res.json({ mensaje: 'Registro modificado exitosamente' });
      } else {
        res.status(404).json({ error: 'Registro no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al modificar el registro' });
    }
  });


  module.exports = router;