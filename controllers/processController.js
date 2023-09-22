const Process = require('../models/Process');
const User = require('../models/User');
const Comment = require('../models/Comment');
const SignOff = require('../models/SignOff');
const {sendMail, addOwner} = require('../utils');


// Create a new process
exports.createProcess = async (req, res) => {
  try {
    if(req.body.users && req.body.title && req.body.userId){
      const { title, users, additionalData } = req.body; // Process title, list of user IDs, and additional data

    if(req.body.users.length>5){
      res.status(400).json({ error: 'You can request signOff from maximum 5 users' });
      return;
    }
    const email = await User.findAll({
      attributes: ['email'], // Specify the attribute(s) you want to retrieve
      where: {
        id: users, // Filter based on the _ids
      },
    })
    const emailIdsArray = email.map((user) => user.email);
    console.log("email>>>>>",emailIdsArray);
    const unique = [...new Set(users)];
    const uniqueEmail = [...new Set(emailIdsArray)];
    // Create the process
    const process = await Process.create({
      title,
      creator_id: req.body.userId, // The creator's user ID
      invitedUsers: unique, // The creator's user ID
      additional_data: additionalData, // Add any additional data you need
    });
    if(process){
      sendMail(uniqueEmail);
    }

    // Add users to the process (assuming there's a UserProcess model)
    // await process.addUsers(users);

    // Send a success response with the process ID
    res.status(201).json({ process });
    }
    else{
    res.status(400).json({ error: 'Please provide all the valid data' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a list of processes for the authenticated user
exports.getListOfProcesses = async (req, res) => {
  try {
    // Retrieve processes associated with the user
    const processes = await Process.findAll({
      where: { creator_id: req.body?.userId },
      // Include any additional attributes or associations you need in the result
    });

    // Send the list of processes in the response
    res.status(200).json(processes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get detailed information about a specific process
exports.viewProcessDetails = async (req, res) => {
  try {
    const processId = req.params.processId;
    let commentAttribute = ['status', 'filename']
    if(req.visible){
      commentAttribute.push('comments');
    }

    // Retrieve the process details, associated comments, and sign-offs
    const process = await Process.findByPk(processId, {
      include: [
        {
          model: SignOff,
          attributes: commentAttribute,
          include: [
            {
              model: User,
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });

    // Check if the user is authorized to view the process
    if (!process ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Send the detailed process information in the response
    res.status(200).json(process);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

exports.commentVisibility = async (req, res) => {
  try {
    const { userIds, processId } = req.body; // List of user IDs to make the comment visible to

    // Ensure the user making the request is the process creator
    const process = await Process.findOne({where:{id: processId}});
    if (!process || process.creator_id !== req.body.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update the comment's visibility settings
    process.commentsVisibleTo = userIds;
    let updated = await process.save();
    if(!process.commentsVisibleTo.includes(process.creator_id)){
      updated = await addOwner(processId);
    }

    res.status(200).json({ message: 'Comment visibility updated successfully',updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const id = req.params.processId;
    const userIds = req.body.userIds;
    const oldProcess = await Process.findByPk(id);
    const email = await User.findAll({
      attributes: ['email'], // Specify the attribute(s) you want to retrieve
      where: {
        id: userIds, // Filter based on the _ids
      },
    })
    const emailIdsArray = email.map((user) => user.email);
    console.log("email>>>>>",emailIdsArray);
    if(email){
      sendMail(emailIdsArray);
    }
    if(!oldProcess){
      res.status(404).send('Not Found');
    }
    let existingUser = oldProcess.invitedUsers;
    for(let i=0; i<userIds.length; i++){
      existingUser.push(userIds[i]);
    }
    if(existingUser.length>5){
      res.status(400).json({ error: `You can request signOff from maximum 5 users, you already have ${oldProcess.invitedUsers} users.` });
      return;
    }
    let unique = [...new Set(existingUser)];
    const process = await Process.update(
      { invitedUsers: unique },
      { where: { id }, returning: true });
    if (process) {
      res.status(200).json(process);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    console.log("error>>>>>>",error);
    res.status(500).send('Internal Server Error');
  }
};
