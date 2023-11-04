const { DataTypes } = require('sequelize');
const InfoParto = require('./InfoParto'); // Asegúrate de especificar la ruta correcta de tu modelo InfoParto
const sequelize = require('../config/sequelize'); // Asegúrate de tener tu configuración de Sequelize correctamente importada

const Tratamiento = sequelize.define('Tratamiento', {
  numero_parto: {
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
  fecha_aplicacion: {
    type: DataTypes.DATE,
  },
  producto: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  dosis: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  causa: {
    type: DataTypes.TEXT,
    charset: 'utf8mb4',
  },
  id_info_parto: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'tratamiento', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt si no las necesitas
});

Tratamiento.belongsTo(InfoParto, { foreignKey: 'id_info_parto' });

module.exports = Tratamiento;
