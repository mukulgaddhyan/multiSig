const SignOff = require('../models/SignOff');
const Process = require('../models/Process');
const { sendMail, addOwner } = require('../utils');
const User = require('../models/User');

// Handle the sign-off process
const signOff = async (req, res) => {
  try {
    const { processId } = req.params;
    const { comments, user, status } = req.body;
    if(!req.file){
        res.status(400).json({ message: 'Please upload an image' });
        return;
    }

    const preeviousSignOffs = await Process.findByPk(processId, {
      include: [
        {
          model: SignOff,
          attributes: ['status'],
          include: [
            {
              model: User,
              attributes: ['name', 'email', 'id'],
            },
          ],
        },
      ],
    });
    const existingUsers = preeviousSignOffs.SignOffs.map((signOff) => {
      if (signOff.User && signOff.User.id) {
        return signOff.User.id;
      }
      return null; // Handle cases where email is missing or undefined
    }).filter((email) => email !== null); // Filter out null or undefined values
  

    const process = await Process.findByPk(processId, {
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });
    console.log("process>>",process);

    const userId = parseInt(req.body.user);
    if (existingUsers.some((user) => user === userId)) {
      res.status(400).json({ message: 'You have already provided the signOff.' });
      return;
    }
    if (!process.invitedUsers.includes(userId)) {
      res.status(400).json({ message: 'You are not requested for a signOff.' });
      return;
    }

    addOwner(processId);
    const image = req.file;
    console.log(">>>>>>>>>",req.body);
    console.log(">>>>>>>>>img",req.file);

    // Handle image upload and validation here

    // Create a new sign-off entry
    const signOffEntry = await SignOff.create({
      comments,
      status: status,
      filename: image.originalname,
      data: image.buffer,
      user_id: user,
      process_id: processId, // Associate the sign-off with a process
    //   user_id: req.user.id, // Assuming you have authentication in place
    });

    if(process){
      sendMail(process.User.email, "toCreator");
    }

    const signOffs = await Process.findByPk(processId, {
      include: [
        {
          model: SignOff,
          attributes: ['status'],
          include: [
            {
              model: User,
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });

    if (signOffs.SignOffs.length == 5) {
      process.status = 'approved';
      process.save();
      const emailIdsArray = signOffs.SignOffs.map((signOff) => {
        if (signOff.User && signOff.User.email) {
          return signOff.User.email;
        }
        return null; // Handle cases where email is missing or undefined
      }).filter((email) => email !== null); // Filter out null or undefined values
    
      console.log("email>>>>>", emailIdsArray);
      emailIdsArray.push(process.User.email);
      const uniqueEmail = [...new Set(emailIdsArray)];
      sendMail(uniqueEmail, "allSignedOff");
    }
    // Update the process status to 'approved' (or handle status changes after 5 approvals)
    // await Process.update(
    //   { status: 'approved' },
    //   { where: { id: processId } }
    // );

    res.status(201).json({ message: 'Sign-off successful', data: signOffEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while signing off.' });
  }
};

module.exports = {
  signOff,
};
