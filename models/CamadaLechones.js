const { DataTypes } = require('sequelize');
const Destete = require('./Destete'); // Importa el modelo Destete con la ruta correcta
const sequelize = require('../config/sequelize');

const CamadaLechones = sequelize.define('CamadaLechones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo_camada: {
    type: DataTypes.STRING,
  },
  id_cerda: {
    type: DataTypes.INTEGER,
  },
  numero_parto: {
    type: DataTypes.INTEGER,
  },
  cerda_nombre: {
    type: DataTypes.STRING,
  },
  tip_carga: {
    type: DataTypes.STRING,
  },
  barraco_nombre: {
    type: DataTypes.STRING,
  },
  pacha_nombre: {
    type: DataTypes.STRING,
  },
  fecha_parto: {
    type: DataTypes.DATE,
  },
  fecha_destete: {
    type: DataTypes.DATE,
  },
  lechones: {
    type: DataTypes.INTEGER,
  },
  id_destete: {
    type: DataTypes.INTEGER,
    references: {
      model: Destete,
      key: 'id',
    },
  },
  precio_unidad: {
    type: DataTypes.DECIMAL(10, 2), // DECIMAL con 10 dígitos totales y 2 decimales
  },
}, {
  tableName: 'camada_lechones', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

CamadaLechones.belongsTo(Destete, { foreignKey: 'id_destete' });

module.exports = CamadaLechones;
