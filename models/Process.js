const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const SignOff = require('./SignOff');

const Process = sequelize.define('Process', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
  },
  invitedUsers: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Define the data type of array elements (INTEGER in this case)
    allowNull: false,
    defaultValue: [], // Use an empty array as the default value
  },
  commentsVisibleTo: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  }
});

// Define associations
Process.belongsTo(User, { foreignKey: 'creator_id' });
Process.hasMany(SignOff, { foreignKey: 'process_id' });

module.exports = Process;
