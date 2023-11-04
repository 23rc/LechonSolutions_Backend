const { DataTypes } = require('sequelize');
const InfoParto = require('./InfoParto'); // Reemplaza con la ruta correcta a tu modelo InfoParto

const sequelize = require('../config/sequelize'); // Reemplaza con la configuración de Sequelize adecuada

const Temperatura = sequelize.define('Temperatura', {
  numero_partoT: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_cerdaT: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cerda_nombreT: {
    type: DataTypes.TEXT,
  },
  fechaT: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  temperaturaT: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  horaT: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  observacionT: {
    type: DataTypes.TEXT,
  },
  id_info_partoT: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'temperatura', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

Temperatura.belongsTo(InfoParto, { foreignKey: 'id_info_partoT' });

module.exports = Temperatura;
