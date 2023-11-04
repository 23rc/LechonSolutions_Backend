// models/Sesion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Sesion = sequelize.define('Sesion', {
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User', // Nombre del modelo de usuario
      key: 'id', // Clave primaria del modelo de usuario
    },
  },
  fecha_inicio_sesion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  direccion_ip: {
    type: DataTypes.STRING,
  },
  dispositivo: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'sesion', // Nombre de la tabla en la base de datos para las sesiones
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Sesion;
