// models/Pacha.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pacha = sequelize.define('Pacha', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false, // Ajusta esto según tus requisitos
  },
  fechaIngreso: {
    type: DataTypes.DATE,
    allowNull: false, // Ajusta esto según tus requisitos
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
  },
  observacion: {
    type: DataTypes.STRING,
  },
  origenGenetico: {
    type: DataTypes.STRING(100), // Longitud máxima de 100 caracteres
  },
  lote: {
    type: DataTypes.STRING(50), // Longitud máxima de 50 caracteres
  },
  cantidad: {
    type: DataTypes.INTEGER, // Tipo de dato para la cantidad
  },
  calidad: {
    type: DataTypes.STRING(50), // Longitud máxima de 50 caracteres
  },
  temperaturaAlmacenamiento: {
    type: DataTypes.STRING(50), // Longitud máxima de 50 caracteres
  },
}, {
  tableName: 'pacha', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Pacha;
