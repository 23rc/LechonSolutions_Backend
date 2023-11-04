// server.js
const http = require('http');
const app = require('./app');
const sequelize = require('./config/sequelize');
const Barraco =require ('./models/Barraco')
const CamadaLechones =require ('./models/CamadaLechones')
const Cerdas =require ('./models/Cerdas')
const Cliente =require ('./models/Cliente')
const Compras =require ('./models/Compras')
const ControlCerda =require ('./models/ControlCerda')
const ControlParto=require ('./models/ControlParto')
const Destete=require ('./models/Destete')
const InfoParto=require ('./models/InfoParto')
const Pacha=require ('./models/Pacha')
const Parto=require ('./models/Parto')
const Permiso=require ('./models/Permiso')
const Producto=require ('./models/Producto')
const Proveedor=require ('./models/Proveedor')
const ResumenParto=require ('./models/ResumenParto')
const Sesion=require ('./models/Sesion')
const Temperatura=require ('./models/Temperatura')
const Tratamiento=require ('./models/Tratamiento')
const User=require ('./models/User')
const Ventas=require ('./models/Ventas')


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