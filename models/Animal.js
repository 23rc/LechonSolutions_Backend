// models/Animal.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de ajustar la ruta según la configuración de tu proyecto

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_animal: {
    type: DataTypes.STRING(50),
  },
  fechaIngreso: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(255),
  },
  peso: {
    type: DataTypes.STRING,
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
  ultimaActualizacion: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'animales', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Animal;
