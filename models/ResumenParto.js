const { DataTypes } = require('sequelize');
const InfoParto = require('./InfoParto'); // Asegúrate de usar la ruta correcta para el modelo InfoParto

const sequelize = require('../config/sequelize'); // Asegúrate de usar la configuración correcta para Sequelize

const ResumenParto = sequelize.define('ResumenParto', {
  numero_parto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_cerda: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cerda_nombre: {
    type: DataTypes.STRING,
    charset: 'utf8mb4',
  },
  nacidos_vivos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nacidos_muertos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nacidos_momias: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  atendidoPor: {
    type: DataTypes.STRING,
    allowNull: true, // Ahora se permiten valores nulos
  },
  
  hora_inicio: {
    type: DataTypes.TIME,
  },
  hora_final: {
    type: DataTypes.TIME,
  },
  id_info_parto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'resumen_parto', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt
});

ResumenParto.belongsTo(InfoParto, { foreignKey: 'id_info_parto' }); // Establece la relación con la tabla InfoParto

module.exports = ResumenParto;
