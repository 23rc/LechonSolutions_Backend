// models/Ventas.js

const { DataTypes } = require('sequelize');
const Cliente = require('./Cliente'); // Reemplaza con la ruta correcta a tu modelo de Cliente
const CamadaLechones = require('./CamadaLechones'); // Reemplaza con la ruta correcta a tu modelo de CamadaLechones
const sequelize = require('../config/sequelize');

const Ventas = sequelize.define('Ventas', {
  codigo_camada: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cantidad_vendida: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'ventas', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

Ventas.belongsTo(Cliente, { foreignKey: 'IDCliente' });
Ventas.belongsTo(CamadaLechones, { foreignKey: 'IDCamada' });

module.exports = Ventas;
