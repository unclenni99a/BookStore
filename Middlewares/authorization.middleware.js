// Checking if the user is authenticated
const user = require('../Database/Models/user');
const isAuthorized = (req,res,next)  => {
    // If there is no token
    if(!req.headers.authorization)
    {
        res.status(401).send("unauthorized");
        return;
    }

    let userId = user.verifyToken(req.headers.authorization);
    if(userId !== null)
    {
        next();
    }
    else
    {
        res.status(401).send("unauthorized")
    }
}

module.exports = isAuthorized