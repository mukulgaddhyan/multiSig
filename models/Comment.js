// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SignOff = require('./SignOff');
const User = require('./User');
const Process = require('./Process');

const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Define associations
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(SignOff, { foreignKey: 'process_id' });
Comment.belongsTo(Process, {foreignKey:'process_id'})

module.exports = Comment;
