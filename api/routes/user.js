const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Sesion = require('../../models/Sesion');
const Permiso = require('../../models/Permiso');
require('dotenv').config(); // Carga las variables de entorno desde .env

const Sequelize = require('sequelize');
const verifyToken = require('../middleware/verifyToken');


const multer = require('multer');
const sequelize = new Sequelize('LechonSolutionsDB', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3308, // Cambia el puerto aquí
});
  /**-------------------------------------Reporte de Usuarios------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});
// Ruta para obtener un usuario por su ID, incluyendo los permisos
router.get('/usuarios/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Busca los permisos para este usuario en la tabla 'permisos'
    const permisos = await Permiso.findOne({ where: { user_id: userId } });

    if (!permisos) {
      return res.status(404).json({ error: 'Permisos no encontrados para este usuario.' });
    }

    // Combina los datos del usuario y los permisos en una respuesta
    const usuarioConPermisos = {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      // Agrega otros campos del usuario aquí...
      consulta: permisos.consulta === 'Si', // Convierte el valor de texto en booleano
      registro: permisos.registro === 'Si',
      reportes: permisos.reportes === 'Si',
      inventario: permisos.inventario === 'Si',
      control: permisos.control === 'Si',
      usuarios: permisos.usuarios === 'Si',
    };

    res.json(usuarioConPermisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

function isNewerThanADay(date) {
  const unDiaEnMilisegundos = 24 * 60 * 60 * 1000; // 1 día en milisegundos
  const hoy = new Date();
  return hoy - date < unDiaEnMilisegundos;
}

// Middleware para verificar la inactividad del usuario
function checkInactivity(req, res, next) {
  const { usuario } = req.body; // Obtén el nombre de usuario del cuerpo de la solicitud

  // Encuentra al usuario por nombre de usuario en la base de datos
  User.findOne({ where: { usuario } }).then((user) => {
    if (user) {
      const tresDiasEnMilisegundos = 3 * 24 * 60 * 60 * 1000; // 3 días en milisegundos
      const hoy = new Date();
      
      // Verifica si ha pasado más de 3 días desde el último inicio de sesión
      if (hoy - user.ultimoInicioSesion > tresDiasEnMilisegundos) {
        // Actualiza el estado de la cuenta a 'inactivo'
        User.update({ estadoCuenta: 'inactivo' }, { where: { id: user.id } }).then(() => {
          // Actualiza la fecha de último inicio de sesión a la fecha actual
          User.update({ ultimoInicioSesion: hoy }, { where: { id: user.id } }).then(() => {
            // Continúa con la siguiente middleware o función
            next();
          }).catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error en el servidor.' });
          });
        }).catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Hubo un error en el servidor.' });
        });
      } else {
        // Si no ha pasado suficiente tiempo, continúa con la función 'signin'
        next();
      }
    } else {
      // Si no se encuentra el usuario, continúa con la función 'signin'
      next();
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  });
}
// Ruta para iniciar sesión++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.post('/signin', async (req, res) => {
  const { usuario, pass } = req.body;

  if (!usuario || !pass) {
    res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    return;
  }

  try {
    const user = await User.findOne({ where: { usuario } });

    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado en la base de datos.' });
      return;
    }
    if (user) {
      // Verificar el estado de la cuenta
      switch (user.estadoCuenta) {
        case 'inactivo':
          // Respondemos con un mensaje de cuenta desactivada
          res.status(401).json({ error: 'Cuenta desactivada por inactividad: Por favor, ponte en contacto con el soporte técnico.' });
          return; // Detener la ejecución

        case 'suspendido':
          // Respondemos con un mensaje de cuenta suspendida
          res.status(401).json({ error: 'Cuenta suspendida por infringir las normas: Por favor, ponte en contácto con el sopote técnico.' });
          return; // Detener la ejecución

        case 'eliminado':
          // Respondemos con un mensaje de cuenta eliminada
          res.status(401).json({ error: 'Cuenta eliminada permanentemente: Para mayor información ponte en contácto con el soporte técnico.' });
          return; // Detener la ejecución

          case 'activo':
            const tresDiasEnMilisegundos = 3 * 24 * 60 * 60 * 1000; // 3 días en milisegundos
            const hoy = new Date();
          
            // Verificar si el rol del usuario es "empleado" antes de aplicar la inactividad
            if (user.rol !== 'Administrador') {
              if (user.ultimoInicioSesion) {
                // Verificar si ha pasado más de 3 días desde el último inicio de sesión
                if (hoy - user.ultimoInicioSesion > tresDiasEnMilisegundos) {
                  // Si ha pasado más de 3 días, actualiza la fecha de último inicio de sesión y cambia el estado a 'inactivo'.
                  await User.update({ ultimoInicioSesion: new Date(), estadoCuenta: 'inactivo' }, { where: { id: user.id } });
                  // Respondemos con un mensaje de cuenta inactiva debido a la inactividad
                  res.status(401).json({ error: 'Cuenta inactiva debido a la inactividad: Por favor, ponte en contacto con el soporte.' });
                  return; // Detener la ejecución
                }
              } else {
                // Si la fecha de último inicio de sesión está vacía, permite el inicio de sesión y actualiza la fecha sin cambiar el estado.
                await User.update({ ultimoInicioSesion: new Date() }, { where: { id: user.id } });
              }
            }
//*****************************************************************************************************************/          
            // Consulta para obtener los permisos del usuario
            const permisos = await Permiso.findOne({ where: { user_id: user.id } });

            if (!permisos) {
              // Si no se encontraron permisos, responder con un error
              console.log('No se encontraron permisos para este usuario.');
              res.status(401).json({ error: 'No se encontraron permisos para este usuario.' });
              return; // Detener la ejecución
            }

            // Agregar console.log para mostrar los permisos en la consola
            console.log('Permisos encontrados:', permisos);
  //****************************************************************************************************************/     
          // Continúa con el proceso de inicio de sesión sin inactivar la cuenta.

          const match = await bcrypt.compare(pass, user.pass);

          if (match) {
            // Crear una nueva sesión en la tabla de Sesiones
            const sessionData = {
              usuario_id: user.id,
              fecha_inicio_sesion: new Date(),
              direccion_ip: req.ip,
              dispositivo: req.headers['user-agent'],
            };

            await Sesion.create(sessionData);

            // Generar un token JWT
            const data = { usuario: user.usuario, 
              rol: user.rol, 
              nombres: user.nombres, 
              apellidos: user.apellidos, 
              imagenPerfil: user.imagenPerfil,
              permisos: permisos };
             

              console.log('Token con permisos:', data); // Agrega este console.log para ver el token con los permisos en la consola del servidor

            const token = generateToken(data);

            
            // Devuelve el token, el nombre y el rol del usuario en la respuesta
            res.json({ 
              permisos: {
                consulta: permisos.consulta,
                registro: permisos.registro,
                reportes: permisos.reportes,
                inventario: permisos.inventario,
                control: permisos.control,
                usuarios: permisos.usuarios,
              },
              token, 
              nombre: user.nombres, 
              apellidos: user.apellidos, 
              rol: user.rol, imagenPerfil: 
              user.imagenPerfil });
              console.log('Permisos encontrados:', permisos);
          } else {
            res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
          }
      }
    } else {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


// Función para generar un token JWT
function generateToken(data) {
  const secretKey = process.env.SECRET_KEY; // Accede a la clave secreta desde las variables de entorno
  return jwt.sign(data, secretKey, { expiresIn: '8h' }); // Token expirará en 1 minuto
}

// Ruta para obtener permisos por usuario
router.get('/usuarios/:userId/permisos', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Busca los permisos para este usuario en la tabla 'permisos'
    const permisos = await Permiso.findOne({ where: { user_id: userId } });

    if (!permisos) {
      return res.status(404).json({ error: 'Permisos no encontrados para este usuario.' });
    }

    // Combina los datos del usuario y los permisos en una respuesta
    const usuarioConPermisos = {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      consulta: permisos.consulta === 'Si',
      registro: permisos.registro === 'Si',
      reportes: permisos.reportes === 'Si',
      inventario: permisos.inventario === 'Si',
      control: permisos.control === 'Si',
      usuarios: permisos.usuarios === 'Si',
    };

    res.json(usuarioConPermisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});



// Middleware para verificar el token
/*function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto');

    // Verificar si el token ha expirado
    const tokenExpirationDate = new Date(decoded.exp * 1000); // convertir a milisegundos
    const currentDate = new Date();

    if (currentDate > tokenExpirationDate) {
      // El token ha expirado, cierra la sesión del usuario aquí
      // Por ejemplo, puedes agregar lógica para eliminar la sesión o realizar otras acciones necesarias.
      // Luego, responde con un mensaje de error de sesión expirada
      return res.status(401).json({ error: 'Sesión expirada: Por favor, vuelve a iniciar sesión.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token inválido' });
  }
}*/

/**-------------------------------------INSERTAR------------------------------------- */

/**-------------------------------------INSERTAR------------------------------------- */
// Ruta para insertar un nuevo usuario con permisos y actualizar los permisos

router.post('/userInsertar', async (req, res) => {
  const {
    nombres,
    apellidos,
    usuario,
    rol,
    pass,
    correo,
    fechaRegistro,
    ultimoInicioSesion,
    telefono,
    imagenPerfil,
    estadoCuenta,
    consulta,
    registro,
    reportes,
    inventario,
    control,
    usuarios,
  } = req.body;

  try {
    const saltRounds = 10; // Número de rondas de sal (ajusta según tus necesidades)
    const hashedPass = await bcrypt.hash(pass, saltRounds);


    // Creamos el usuario en la tabla 'user'
    const newUser = await User.create({
      nombres,
      apellidos,
      usuario,
      rol,
      pass: hashedPass,
      correo,
      fechaRegistro,
      ultimoInicioSesion,
      telefono,
      imagenPerfil,
      estadoCuenta,
    });

    // Obtén el ID autoincrementable del usuario recién creado
    const userId = newUser.getDataValue('id');

    // Creamos un registro en la tabla 'permiso' con los mismos valores de 'rol' y 'user_id'
    const newPermiso = await Permiso.create({
      user_id: userId, // Usamos el ID del usuario recién creado
      rol,
      consulta,
      registro,
      reportes,
      inventario,
      control,
      usuarios,
    });

    // Obtén el ID autoincrementable del registro de permiso recién creado
    const permisoId = newPermiso.getDataValue('id');

    // Actualizamos los datos de permiso recién creados
    newPermiso.consulta = consulta;
    newPermiso.registro = registro;
    newPermiso.reportes = reportes;
    newPermiso.inventario = inventario;
    newPermiso.control = control;
    newPermiso.usuarios = usuarios;

    // Guardamos los cambios en los datos de permiso
    await newPermiso.save();

    res.status(201).json({ id: userId, message: 'Usuario insertado exitosamente.' }); // Devolvemos el ID del usuario recién creado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

// Ruta para actualizar los datos de permiso para un usuario específico
router.put('/actualizarPermiso/:userId', async (req, res) => {
  const userId = req.params.userId; // Obtén el ID del usuario al que deseas actualizar los permisos
  const {
    consulta,
    registro,
    reportes,
    inventario,
    control,
    usuarios,
  } = req.body;

  try {
    // Busca el registro de permiso para el usuario específico
    const permiso = await Permiso.findOne({ where: { user_id: userId } });

    if (!permiso) {
      return res.status(404).json({ error: 'Permiso no encontrado para este usuario.' });
    }

    // Actualiza los datos de permiso
    permiso.consulta = consulta;
    permiso.registro = registro;
    permiso.reportes = reportes;
    permiso.inventario = inventario;
    permiso.control = control;
    permiso.usuarios = usuarios;

    // Guarda los cambios en la base de datos
    await permiso.save();

    res.status(200).json({ message: 'Datos de permiso actualizados exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

/**-------------------------------------ELIMINAR------------------------------------- */
router.delete('/userEliminacion/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Elimina todos los permisos relacionados con el usuario
    await Permiso.destroy({ where: { user_id: userId } });

    // Luego elimina todas las sesiones relacionadas con el usuario
    await Sesion.destroy({ where: { usuario_id: userId } });

    // Finalmente, elimina al usuario
    const result = await User.destroy({ where: { id: userId } });

    if (result === 1) {
      res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


/**-------------------------------------EDITAR------------------------------------- */
router.put('/userEditar/:id', async (req, res) => {
  const userId = req.params.id;
  const {
    nombres,
    apellidos,
    usuario,
    rol,
    correo,
    telefono,
    imagenPerfil,
    estadoCuenta,
    consulta,
    registro,
    reportes,
    inventario,
    control,
    usuarios,
  } = req.body;

  try {
    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar campos comunes (nombres, apellidos, usuario, rol, correo, telefono, etc.)
    existingUser.nombres = nombres;
    existingUser.apellidos = apellidos;
    existingUser.usuario = usuario;
    existingUser.rol = rol;
    existingUser.correo = correo;
    existingUser.telefono = telefono;
    existingUser.imagenPerfil = imagenPerfil;
    existingUser.estadoCuenta = estadoCuenta;

    // Guardar los cambios en el usuario
    await existingUser.save();

    // Actualizar los campos de permiso si son proporcionados
    if (consulta || registro || reportes || inventario || control || usuarios) {
      const existingPermiso = await Permiso.findOne({ where: { user_id: userId } });

      if (existingPermiso) {
        // Actualizar los campos de permiso si existe un registro de permiso para el usuario
        existingPermiso.consulta = consulta;
        existingPermiso.registro = registro;
        existingPermiso.reportes = reportes;
        existingPermiso.inventario = inventario;
        existingPermiso.control = control;
        existingPermiso.usuarios = usuarios;
        await existingPermiso.save();
      } else {
        // Crear un nuevo registro de permiso si no existe uno
        await Permiso.create({
          user_id: userId,
          consulta,
          registro,
          reportes,
          inventario,
          control,
          usuarios,
        });
      }
    }

    res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


/**-------------------------------------Obtener Datos para la Gráfica de Estado de Usuarios------------------------------------- */
router.get('/userStatusData',async (req, res) => {
  try {
    // Realiza la consulta a la base de datos para obtener la cantidad de usuarios en cada estado
    const statusData = await User.findAll({
      attributes: ['estadoCuenta', [sequelize.fn('COUNT', sequelize.col('estadoCuenta')), 'count']],
      group: ['estadoCuenta'],
    });

    // Formatea los datos para la gráfica
    const chartData = statusData.map((status) => ({
      estado: status.estadoCuenta,
      cantidad: status.get('count'),
    }));

    res.json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});


module.exports = router;