const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de tener tu configuración de Sequelize correctamente importada
const InfoParto = require('./InfoParto'); // Reemplaza con la ubicación correcta del modelo de InfoParto

const Parto = sequelize.define('Parto', {
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
    allowNull: false,
  },
  cerda_nombre: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  fecha: {
    type: DataTypes.DATE,
  },
  peso: {
    type: DataTypes.DECIMAL(5, 2),
  },
  m_h: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  estado: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  id_info_parto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'partos', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt si no las necesitas
});

Parto.belongsTo(InfoParto, { foreignKey: 'id_info_parto' });

module.exports = Parto;
