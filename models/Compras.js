const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de proporcionar la ruta correcta al archivo de configuración de Sequelize.
const Producto = require('./Producto'); // Reemplaza con la ruta correcta a tu modelo de Producto
const Proveedor = require('./Proveedor'); // Reemplaza con la ruta correcta a tu modelo de Proveedor

const Compras = sequelize.define('Compras', {
  nombreProducto: {
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
  IDProveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Proveedor,
      key: 'id',
    },
  },
  IDProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id',
    },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'compras', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});


Compras.belongsTo(Producto, { foreignKey: 'IDProducto' });
Compras.belongsTo(Proveedor, { foreignKey: 'IDProveedor' });

module.exports = Compras;
