const express = require('express');
const router = express.Router();
const signOffController = require('../controllers/signOffController');
const multer = require('multer');

// Set up multer storage and upload options
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });


// Define the route for signing off a process
router.post('/:processId', upload.single('image'), signOffController.signOff);


module.exports = router;
