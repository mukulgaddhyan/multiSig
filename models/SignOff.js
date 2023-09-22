const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Import the User model
const Process = require('./Process'); // Import the Process model

const SignOff = sequelize.define('SignOff', {
    comments: {
        type: DataTypes.TEXT,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.BLOB, // Binary data type for storing images
        allowNull: false,
      },
      status: {
          type: DataTypes.ENUM('pending approval', 'approved', 'rejected'),
          allowNull: false,
          defaultValue: 'pending approval', // Set a default status if needed
        },
    signOffDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set default value to current timestamp
    },
});

// Define associations
// SignOff.belongsTo(Process, { foreignKey: 'process_id' })
SignOff.belongsTo(User, { foreignKey: 'user_id' });

module.exports = SignOff;
