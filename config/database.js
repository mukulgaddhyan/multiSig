// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('multisig', 'mukul', '123456', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
