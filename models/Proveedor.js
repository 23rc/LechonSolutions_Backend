const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de proporcionar la ruta correcta al archivo de configuración de Sequelize.

const Proveedor = sequelize.define('Proveedor', {
  nombreProveedor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  direccion: {
    type: DataTypes.STRING,
  },
  ciudad: {
    type: DataTypes.STRING,
  },

}, {
  tableName: 'proveedores', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

module.exports = Proveedor;
