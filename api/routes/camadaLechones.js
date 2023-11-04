const express = require('express');
const router = express.Router();
const CamadaLechones = require('../../models/CamadaLechones'); // Asegúrate de que la ruta sea correcta según la ubicación de tu modelo CamadaLechones
const Destete = require('../../models/Destete'); 

router.get('/', async (req, res) => {
  try {
    const camadas = await CamadaLechones.findAll();
    res.json(camadas);
  } catch (error) {
    console.error("Error al obtener datos de camadas de lechones:", error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



// Ruta para eliminar un registro por su ID
router.delete('/camada-lechones/:id', async (req, res) => {
  const camadaId = req.params.id;

  try {
    // Busca el registro por su ID
    const camada = await CamadaLechones.findByPk(camadaId);

    if (!camada) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    // Elimina el registro
    
    await camada.destroy();

    return res.status(204).send(); // Devuelve una respuesta exitosa
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});
router.put('/editarPrecioUnitario/:id', async (req, res) => {
  const camadaId = req.params.id;
  const { precio_unidad } = req.body;

  try {
    const result = await CamadaLechones.update(
      { precio_unidad: precio_unidad },
      { where: { id: camadaId } }
    );

    if (result[0] === 1) {
      res.status(200).json({ mensaje: 'precio_unidad actualizado exitosamente' });
    } else {
      res.status(404).json({ mensaje: 'Camada no encontrada o ningún cambio realizado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Hubo un error en el servidor al actualizar el precio_unidad' });
  }
});
// Ruta para editar un registro de CamadaLechones por su ID
router.put('/editarCamadaLechones/:id', async (req, res) => {
  const camadaLechonesId = req.params.id;
  const {
    codigo_camada,
    id_cerda,
    numero_parto,
    cerda_nombre,
    tip_carga,
    barraco_nombre,
    pacha_nombre,
    fecha_parto,
    fecha_destete,
    lechones,
    id_destete,
    precio_unidad,
  } = req.body;

  try {
    // Verifica si el registro de CamadaLechones existe
    const camadaLechones = await CamadaLechones.findByPk(camadaLechonesId);

    if (!camadaLechones) {
      return res.status(404).json({ message: 'Registro de CamadaLechones no encontrado.' });
    }

    // Realiza la actualización del registro
    const result = await camadaLechones.update({
      codigo_camada,
      id_cerda,
      numero_parto,
      cerda_nombre,
      tip_carga,
      barraco_nombre,
      pacha_nombre,
      fecha_parto,
      fecha_destete,
      lechones,
      id_destete,
      precio_unidad,
    });

    if (result) {
      res.status(200).json({ message: 'Registro de CamadaLechones actualizado exitosamente.' });
    } else {
      res.status(500).json({ error: 'Hubo un error al actualizar el registro de CamadaLechones.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Ruta para obtener una camada de lechones por su ID
router.get('/camadaLechones/:id', async (req, res) => {
  const camadaId = req.params.id;

  try {
    const camada = await CamadaLechones.findOne({ where: { id: camadaId } });

    if (camada) {
      res.status(200).json(camada);
    } else {
      res.status(404).json({ message: 'Camada de lechones no encontrada.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

router.post('/insertarCamada', async (req, res) => {
    try {
      let codigo_camada;
      let isCodeUnique = false;
  
      // Función para generar un código único de 5 caracteres alfanuméricos
      function generateUniqueCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
        return code;
      }
  
      // Verificar si el código generado es único
      while (!isCodeUnique) {
        codigo_camada = generateUniqueCode();
        const existingCamada = await CamadaLechones.findOne({ where: { codigo_camada } });
        if (!existingCamada) {
          isCodeUnique = true;
        }
      }
  
      // Capturar la fecha actual
      const fecha_destete = new Date();
      const {
        id_cerda,
        numero_parto,
        cerda_nombre,
        tip_carga,
        barraco_nombre,
        pacha_nombre,
        fecha_parto,
        lechones,
        id_destete,
      } = req.body;
  
     
  
      const newCamada = await CamadaLechones.create({
        codigo_camada,
        id_cerda,
        numero_parto,
        cerda_nombre,
        tip_carga,
        barraco_nombre,
        pacha_nombre,
        fecha_parto,
        fecha_destete,
        lechones,
        id_destete,
      });
  
      // Realizar la actualización en la tabla destete
      const updatedDestete = await Destete.update(
        { estado: 'Cargado' }, // Valores a actualizar
        { where: { id: id_destete } } // Condición para la actualización
      );
      if (updatedDestete[0] === 1) {
        // La actualización fue exitosa
        res.json(newCamada);
      } else {
        // No se pudo encontrar el registro en la tabla destete
        res.status(404).json({ error: 'Registro de destete no encontrado' });
      }
    } catch (error) {
      console.error("Error al insertar datos de camada de lechones:", error);
      res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }
  });


  router.put('/actualizarCantidad/:id', async (req, res) => {
    const camadaId = req.params.id;
    const { cantidadVendida } = req.body;
  
    try {
      // Encuentra la camada por su ID
      const camada = await CamadaLechones.findOne({ where: { id: camadaId } });
  
      if (camada) {
        // Actualiza la cantidad de lechones
        camada.lechones -= cantidadVendida;
  
        // Guarda los cambios en la base de datos
        await camada.save();
  
        res.status(200).json({ message: 'Cantidad de lechones actualizada con éxito' });
      } else {
        res.status(404).json({ message: 'Camada de lechones no encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error en el servidor al actualizar la cantidad de lechones.' });
    }
  });
  
 // Ruta para eliminar un Destete y sus CamadaLechones relacionados
 router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      // Verifica si el registro de Destete existe
      const destete = await Destete.findByPk(id);
  
      if (!destete) {
        return res.status(404).json({ message: 'Registro de Destete no encontrado.' });
      }
  
      // Elimina el registro de Destete
      await destete.destroy();
  
      res.status(204).json();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el registro de Destete.' });
    }
  });
  
  
  
module.exports = router;
