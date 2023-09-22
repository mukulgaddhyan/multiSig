// app.js (or index.js)
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const processRoutes = require('./routes/processRoutes');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const signOff = require('./routes/signOffRoutes');
const { sign } = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());

// Initialize Sequelize and sync the database
sequelize
  .sync()
  .then(() => {
    console.log('Database connected and synced.');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

app.use('/auth', authRoutes);
app.use('/process', processRoutes);
app.use('/user', userRoutes);
app.use('/signOff', signOff);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
