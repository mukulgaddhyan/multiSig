const nodemailer = require("nodemailer");
const Process = require('./models/Process');

const generateRandomLoginId = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let loginId = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        loginId += charset.charAt(randomIndex);
    }
    return loginId;
};

const sendMail = async (email, signedOff) => {
    try{
        if(email.length == 0){
            return;
        }
        let text = "";
        let html = "";
        let testAccount = nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: "stephen.rodriguez54@ethereal.email",
                pass: "gMHNBXcBnf3xXnkYdM",
            },
        });
        if(signedOff === "toCreator"){
            text = "Hi Creator, A User has Signed-Off your process." 
            html = `<b>Hi Creator,</b><br><br>
            A User has Signed-Off your process. Please have a look at the comments.<br><br>
            <b>Regards,</b><br>
            <b>MultiSig</b>.`
        }
        else if(signedOff === 'allSignedOff'){
            text = "Hi User, Congratulations the process has been signed off by all the users..", // plain text body
            html = `<b>Hi User,</b><br><br>
            Congratulations the process has been signed off by all the users..<br><br>
            <b>Regards,</b><br>
            <b>MultiSig</b>.`
        }
        else{
            text = "Hi User, A Sign-Off is requested from you.", // plain text body
            html = `<b>Hi User,</b><br><br>
            A Sign-Off is requested from you. Please provide your approval/denial for the same.<br><br>
            <b>Regards,</b><br>
            <b>MultiSig</b>.`
        }

        let info = await transporter.sendMail({
            from: '"Mukul Gaddhyan" <multisig@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "MutiSig Sign-Off",
            text: text, // Subject line
            html: html, // html body
        })
        return;
    }
    catch (error) {
        console.log(">>>>>>>>>>>.",error);
        throw error;
      }
}

const addOwner = async(processId) =>{
    const process = await Process.findOne({where:{id: processId}});
    if (!process ) {
      return res.status(403).json({ error: 'Process not found' });
    }

    if(process.commentsVisibleTo.includes(process.creator_id)){
        return;
    }
    let userIds = process.commentsVisibleTo;
    userIds.push(process.creator_id);
    process.commentsVisibleTo = userIds;
    const updated = await process.save();
    return updated;
}

const secretKey= "dfghjkjhgfdfghj";


module.exports={generateRandomLoginId, secretKey, sendMail, addOwner}