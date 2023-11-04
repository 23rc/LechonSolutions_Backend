const sequelize = require('./config/sequelize'); // Ruta relativa a sequelize.js


sequelize.sync({ force: true }) // Establece force en true para eliminar la tabla
  .then(() => {
    console.log('Tabla eliminada y recreada exitosamente');
    process.exit(0); // Finaliza el proceso después de completar la operación
  })
  .catch((error) => {
    console.error('Error al eliminar y recrear la tabla:', error);
    process.exit(1); // Finaliza el proceso con un código de error en caso de fallo
  });
