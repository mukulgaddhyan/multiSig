const User = require('../models/User');

exports.getAll = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      logError(error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  exports.getById = async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByPk(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send('Not Found');
      }
    } catch (error) {
      logError(error);
      res.status(500).send('Internal Server Error');
    }
  };


  