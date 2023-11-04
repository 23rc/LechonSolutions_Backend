// models/Permiso.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de ajustar la ruta según la configuración de tu proyecto

const Permiso = sequelize.define('Permiso', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User', // Asegúrate de que sea el nombre correcto del modelo de usuarios en tu proyecto
      key: 'id',
    },
  },
  rol: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  consulta: {
    type: DataTypes.ENUM('Si', 'No'),
    allowNull: false,
  },
  registro: {
    type: DataTypes.ENUM('Si', 'No'),
    allowNull: false,
  },
  reportes: {
    type: DataTypes.ENUM('Si', 'No'),
    allowNull: false,
  },
  inventario: {
    type: DataTypes.ENUM('Si', 'No'),
    allowNull: false,
  },
  control: {
    type: DataTypes.ENUM('Si', 'No'),
    allowNull: false,
  },
  usuarios: {
    type: DataTypes.ENUM('Si', 'No'),
    allowNull: false,
  },
}, {
  tableName: 'permiso', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Permiso;
