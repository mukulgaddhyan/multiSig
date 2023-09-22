const { verify } = require("jsonwebtoken");
const { secretKey } = require("./utils");
const Process = require("./models/Process");

const verifyToken = (req, res, next) => {
	const token = req.headers.authorization;
  
	if (!token) {
	  return res.status(401).send('Unauthorized: Token missing');
	}
  
	verify(token, secretKey, (err, decoded) => {
	  if (err) {
		return res.status(401).send('Unauthorized: Invalid token');
	  }
  
	  req.userId = decoded.userId; // Store the user ID in the request
	  next();
	});
  };

const permission = async (req, res, next) => {
    const user = req.userId;
    req.visible = false;
    const id = req.params.processId;
    const access = await Process.findByPk(id);
    for(let i=0; i<access.commentsVisibleTo.length; i++){
        if(user == access.commentsVisibleTo[i])
            req.visible = true;
    }
  	next();
  };

  module.exports={
    verifyToken,
    permission
  }