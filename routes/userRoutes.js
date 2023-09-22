const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../controllers/authController');

//Get all users. DropDown.
router.get('/', userController.getAll);

//Get userById
router.get('/:id', userController.getById);

module.exports = router;
