const express = require('express');
const router = express.Router();
const ControlParto = require('../../models/ControlParto'); // Reemplaza 'ControlParto' con el nombre de tu modelo de control de parto
const ControlCerda = require('../../models/ControlCerda');
const Cerda = require('../../models/Cerda');
const InfoParto = require('../../models/InfoParto');
const sequelize = require('../../config/sequelize'); // Ajusta la ruta a tu configuración de Sequelize




const { QueryTypes } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    // Consulta SQL para obtener datos de control_parto, el campo tetas y el campo peso de la tabla cerda,
    // el campo numero_parto de la tabla info_parto, y los campos pesoFinalP, perdidaPesoP, atendidoPor de la tabla info_parto.
    const query = `
    SELECT
        cp.id AS controlParto_id,
        cp.*,
        c.tetas AS cerda_tetas,
        c.peso AS cerda_peso,
        ip.numero_partoP AS infoParto_numero_parto,
        ip.pesoFinalP AS infoParto_pesoFinal,
        ip.perdidaPesoP AS infoParto_perdidaPeso,
        ip.atendidoPor AS infoParto_atendidoPor,
        ip.id AS infoParto_id
    FROM control_parto cp
    JOIN cerda c ON cp.id_cerda = c.id
    LEFT JOIN info_parto ip ON cp.id_cerda = ip.id_cerdaP
`;


  
    // Ejecuta la consulta SQL
    const controlPartos = await sequelize.query(query, { type: QueryTypes.SELECT });

    res.json(controlPartos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
// Ruta para obtener todos los registros de control_parto
router.get('/control', async (req, res) => {
  try {
    const controlPartos = await ControlParto.findAll();
    if (controlPartos) {
      res.json(controlPartos);
    } else {
      res.status(404).json({ error: 'No se encontraron registros de control_parto.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



// Ruta para insertar un nuevo registro de control de parto
router.post('/controlPartoInsertar', async (req, res) => {
  const { id_control_cerda,id_cerda, 
    cerda_nombre,
    tipo_carga, barraco_nombre, 
    pacha_nombre,
    fecha_inseminacion, 
    fecha_confirmacion_carga, 
    fecha_posible_parto, 
    fecha_sala_parto,
    observaciones } = req.body;

  try {
    await ControlParto.create({
      id_control_cerda,
      id_cerda,
      cerda_nombre,
      tipo_carga,
      barraco_nombre,
      pacha_nombre,
      fecha_inseminacion,
      fecha_confirmacion_carga,
      fecha_posible_parto,
      fecha_sala_parto,
      observaciones,
    });
    
    res.status(201).json({ message: 'Registro de control de parto insertado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
// Ruta para eliminar un registro de control de parto por su ID
router.delete('/controlPartoEliminar/:id', async (req, res) => {
  const controlPartoId = req.params.id;

  try {
    const controlParto = await ControlParto.findByPk(controlPartoId);

    if (!controlParto) {
      return res.status(404).json({ error: 'Registro de control de parto no encontrado.' });
    }

    // Obtener el ID del control_cerda relacionado
    const controlCerdaId = controlParto.id_control_cerda;

    // Eliminar el registro de control_parto
    await controlParto.destroy();

    // Actualizar el campo confirmar_carga en la tabla control_cerda
    const controlCerda = await ControlCerda.findByPk(controlCerdaId);
    if (controlCerda) {
      controlCerda.confirmar_carga = 'No Cargada';
      await controlCerda.save();
    }

    res.status(200).json({ message: 'Registro de control de parto eliminado exitosamente y confirmar_carga actualizado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
// Ruta para editar un registro de control de parto por su ID
router.put('/controlPartoEditar/:id', async (req, res) => {
  const controlPartoId = req.params.id;
  const {
    id_control_cerda,
    id_cerda,
    tipo_carga,
    nombre_barraco,
    fecha_inseminacion,
    fecha_confirmacion_carga,
    fecha_posible_parto,
    fecha_sala_parto,
    observaciones,
  } = req.body;

  try {
    const controlParto = await ControlParto.findByPk(controlPartoId);

    if (!controlParto) {
      return res.status(404).json({ error: 'Registro de control de parto no encontrado.' });
    }

    await controlParto.update({
      id_control_cerda,
      id_cerda,
      tipo_carga,
      nombre_barraco,
      fecha_inseminacion,
      fecha_confirmacion_carga,
      fecha_posible_parto,
      fecha_sala_parto,
      observaciones,
    });

    res.status(200).json({ message: 'Registro de control de parto actualizado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
module.exports = router;