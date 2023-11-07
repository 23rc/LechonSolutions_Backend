// server.js
const http = require('http');
const app = require('./app');
const sequelize = require('./config/sequelize');

const port = process.env.PORT || 3000;

// Sincronizar la base de datos con los modelos de Sequelize
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada exitosamente.');
    const server = http.createServer(app);
    server.listen(port);
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });