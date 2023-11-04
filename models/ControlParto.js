const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de tener tu configuración de Sequelize correctamente importada
const ControlCerda= require('./ControlCerda'); // Replace with the correct file path
const ControlParto = sequelize.define('ControlParto', {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_control_cerda: {
    type: DataTypes.INTEGER,
    allowNull: false,
     },
  id_cerda: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  fecha_inseminacion: {
    type: DataTypes.DATE,
  },
  fecha_confirmacion_carga: {
    type: DataTypes.DATE,
  },
  fecha_posible_parto: {
    type: DataTypes.DATE,
  },
  fecha_sala_parto: {
    type: DataTypes.DATE,
  },
  observaciones: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
}, {
  tableName: 'control_parto', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt si no las necesitas
});



ControlParto.belongsTo(ControlCerda, { foreignKey: 'id_control_cerda' });
module.exports = ControlParto;
