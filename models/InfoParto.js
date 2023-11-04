const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Asegúrate de tener tu configuración de Sequelize correctamente importada
const ControlCerda = require('./ControlCerda'); // Reemplaza con la ruta correcta de tu modelo de ControlCerda

const InfoParto = sequelize.define('InfoParto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_control_cerdaP: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_cerdaP: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numero_partoP: {
    type: DataTypes.INTEGER,
  },
  cerda_nombreP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  fecha_posible_partoP: {
    type: DataTypes.DATE,
  },
  tetasP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  tipo_cargaP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  nombre_barracoP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  pacha_nombreP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  pesoP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  pesoFinalP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  perdidaPesoP: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
  atendidoPor: {
    type: DataTypes.STRING(255),
    charset: 'utf8mb4',
  },
}, {
  tableName: 'info_parto', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva las columnas createdAt y updatedAt si no las necesitas
});



module.exports = InfoParto;
