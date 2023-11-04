// config/sequelize.js

const { Sequelize } = require('sequelize');
const dotenv =require ('dotenv')
dotenv.config()

const dbCredencials ={
  database:process.env.DB_NAME,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  host:process.env.DB_HOST,
  port:process.env.DB_PORT,
};


const sequelize = new Sequelize(
dbCredencials.database,
dbCredencials.user,
dbCredencials.password,
{
  port:dbCredencials.port,
  host:dbCredencials.host,
  dialect: "mysql",
}
);


module.exports = sequelize;
