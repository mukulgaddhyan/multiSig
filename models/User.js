// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  login_id: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  metamaskWallet: {
    type: DataTypes.STRING, // Store Metamask wallet address
  },
});

module.exports = User;
