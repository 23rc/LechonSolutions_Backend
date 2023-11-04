// config/sequelize.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('LechonSolutionsDB', 'root', 'workbench', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3308, // Puerto según el manejador o plataforma.
  //logging: false // Desactiva el registro de consultas
});
module.exports = sequelize;
