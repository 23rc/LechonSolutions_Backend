// models/Cerda.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Cerda = sequelize.define('Cerda', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false, // Puedes ajustar esto según tus requisitos
  },
  tetas: {
    type: DataTypes.STRING,
  },
  
  peso: {
    type: DataTypes.STRING, // Parece que el campo Peso es una cadena en tu tabla
  },
  fechaIngreso: {
    type: DataTypes.DATE,
    allowNull: false, // Puedes ajustar esto según tus requisitos
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
  tableName: 'cerda', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Cerda;
