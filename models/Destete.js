// models/Destete.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Ajusta la ruta según tu configuración

const Destete = sequelize.define('Destete', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numero_parto: {
    type: DataTypes.INTEGER,
  },
  id_cerda: {
    type: DataTypes.INTEGER,
  },
  cerda_nombre: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  tipo_carga: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  barraco_nombre: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  pacha_nombre: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  fecha_parto: {
    type: DataTypes.DATE,
  },
  fecha_destete: {
    type: DataTypes.DATE,
  },
  cantidad_destetar: {
    type: DataTypes.INTEGER,
  },
  atendidoPor: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  id_info_parto: {
    type: DataTypes.INTEGER,
  },
  estado: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
}, {
  tableName: 'destete', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Destete;
