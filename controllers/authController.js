const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {generateRandomLoginId, secretKey, sendMail} = require('../utils');


// Register a new user
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, metamaskWallet } = req.body;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user in the database
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       metamaskWallet,
//     });

//     res.status(201).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.register = async (req, res) => {
    try {
      if (req.body.id) {
        return res.status(400).send('Bad Request: ID should not be provided, since it is determined automatically by the database.');
      }
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
      let loginId;
      let isLoginIdUnique = false;
      while (!isLoginIdUnique) {
        loginId = generateRandomLoginId();
        const existingUser = await User.findOne({ where: { login_id: loginId } });
        if (!existingUser) {
          isLoginIdUnique = true;
        }
      }
      // Create a new user with the hashed password
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        login_id:loginId // Store the hashed password
  
      });
      const responseUser = { ...newUser.toJSON() };
      delete responseUser.password;
  
      res.status(201).json(responseUser);
  
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send('Username already exists');
      }
      console.log(">>>>>>>>>>>.",error);
      res.status(500).send('Internal Server Error');
    }
  };

// Login user
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({
//       where: { email },
//     });

//     // If the user is not found, return an error
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Compare the provided password with the hashed password in the database
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     // If passwords do not match, return an error
//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Generate a JWT token for authentication
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       'your-secret-key', // Replace with your own secret key
//       { expiresIn: '1h' } // Token expiration time
//     );

//     // Send the token in the response
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


exports.login = async (req, res) => {
    try {
      const { login_id, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({
        where: { login_id: login_id },
      });
  
      if (!user) {
        return res.status(401).send('Unauthorized: User not found');
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).send('Unauthorized: Incorrect password');
      }
  
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token: token });
    } catch (error) {
        console.log(">>>>>>>",error);
        res.status(500).send('Internal Server Error');
    }
  };
