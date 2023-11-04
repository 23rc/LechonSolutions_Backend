// models/Cliente.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de ajustar la ruta según la configuración de tu proyecto

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nit: {
    type: DataTypes.STRING(20),
  },
  nombre: {
    type: DataTypes.STRING(100),
  },
  telefono: {
    type: DataTypes.STRING(15),
  },
  correo: {
    type: DataTypes.STRING(100),
  },
  direccion: {
    type: DataTypes.STRING(255),
  }

}, {
  tableName: 'cliente', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Cliente;
