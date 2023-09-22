const SignOff = require('../models/SignOff');
const Process = require('../models/Process');

// Handle the sign-off process
const signOff = async (req, res) => {
  try {
    const { processId } = req.params;
    const { comments, user, status } = req.body;
    if(!req.file){
        res.status(400).json({ message: 'Please upload an image' });
        return;
    }
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
    

    // Update the process status to 'approved' (or handle status changes as needed)
    await Process.update(
      { status: 'approved' },
      { where: { id: processId } }
    );

    res.status(201).json({ message: 'Sign-off successful', data: signOffEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while signing off.' });
  }
};

module.exports = {
  signOff,
};
