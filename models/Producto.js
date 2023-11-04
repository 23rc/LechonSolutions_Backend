const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de proporcionar la ruta correcta al archivo de configuración de Sequelize.
const Proveedor = require('./Proveedor'); // Importa el modelo de proveedores


const Producto = sequelize.define('Producto', {
  nombreProducto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoProducto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
  },
  stock: {
    type: DataTypes.INTEGER,
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
  },
  proveedorID: {
    type: DataTypes.INTEGER,
    references: {
      model: Proveedor,
      key: 'id',
    },
  },
}, {
  tableName: 'productos', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

Producto.belongsTo(Proveedor, { foreignKey: 'proveedorID' });

module.exports = Producto;
