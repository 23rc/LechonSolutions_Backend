// models/ControlCerda.js

const { DataTypes } = require('sequelize');
const Cerda = require('./Cerda'); // Replace with the correct file path
const Barraco = require('./Barraco'); // Replace with the correct file path

const sequelize = require('../config/sequelize');

const ControlCerda = sequelize.define('ControlCerda', {
  cerda_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cerda_nombre: {
    type: DataTypes.STRING,
  },
  barraco_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  barraco_nombre: {
    type: DataTypes.STRING,
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  producto_nombre: {
    type: DataTypes.STRING,
  },
  tipo_carga: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_inseminacion: {
    type: DataTypes.DATE,
  },
  fecha_confirmacion_carga: {
    type: DataTypes.DATE,
  },
  confirmar_carga:{
    type: DataTypes.STRING
  },
  observaciones: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'control_cerda', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});


ControlCerda.belongsTo(Cerda, { foreignKey: 'cerda_id' });
ControlCerda.belongsTo(Barraco, { foreignKey: 'barraco_id' });
module.exports = ControlCerda;
