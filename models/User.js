// models/User.js
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  nombres: {
    type: DataTypes.STRING,
  },
  apellidos: {
    type: DataTypes.STRING,
  },
  usuario: {
    type: DataTypes.STRING,
  },
  rol: {
    type: DataTypes.STRING,
  },
  pass: {
    type: DataTypes.STRING,
  },
  correo: {
    type: DataTypes.STRING,
  },
  fechaRegistro: {
    type: DataTypes.DATE,
  },
  ultimoInicioSesion: {
    type: DataTypes.DATE,
  },
  telefono: {
    type: DataTypes.STRING,
  },

  imagenPerfil: {
    type: Sequelize.TEXT, // Cambia el tipo de dato a TEXT o LONGTEXT
    allowNull: true, // Opcional, dependiendo de tus requerimientos
  },
  estadoCuenta: {
    type: DataTypes.ENUM('activo', 'inactivo', 'suspendido', 'eliminado'),
  }
}, {
  tableName: 'user', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = User;
