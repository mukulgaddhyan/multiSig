const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');
const {verifyToken, permission} = require('../middlewares');

// Create a new process
router.post('/', processController.createProcess);

// Get a list of processes for the authenticated user
router.get('/', processController.getListOfProcesses);

// Get detailed information about a specific process
router.get('/:processId', verifyToken,permission, processController.viewProcessDetails);


router.post('/visibleTo', processController.commentVisibility);

router.post('/:processId/invite', processController.inviteUser);

module.exports = router;
