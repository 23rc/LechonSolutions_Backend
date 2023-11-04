// models/Barraco.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Barraco = sequelize.define('Barraco', {
  nombre: {
    type: DataTypes.STRING,
  },
  peso: {
    type: DataTypes.STRING,
  },
  fechaIngreso: {
    type: DataTypes.DATE,
    
  },
  observacion: {
    type: DataTypes.STRING,
  },
  altura: {
    type: DataTypes.STRING,
  },
  ubicacion: {
    type: DataTypes.STRING,
  },
  estadoSalud: {
    type: DataTypes.STRING,
  },
  temperatura: {
    type: DataTypes.STRING,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2), // DECIMAL con 10 dígitos totales y 2 decimales
  },
}, {
  tableName: 'barraco', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Barraco;
