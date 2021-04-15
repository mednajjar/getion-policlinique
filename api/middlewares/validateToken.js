const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authAdmin = (req, res, next) => {
    res.type = "admin";
    next();
}
exports.authReception = (req, res, next) => {
    res.type = "reception";
    next();
}

exports.auth = async (req, res, next) => {
    const token = req.cookies['auth_token'];
    
    try{
        const verify = await jwt.verify(token, process.env.TOKEN_SECRET);
        const userLog = verify; 
        console.log(userLog)
            if(verify && userLog.role == res.type){
                    const user = await User.findById(userLog.id).select('-password');
                    res.locals.user = user;
                    console.log(res.locals.user._id);
                    console.log(res.locals.user.role);
                    next();
            }else{
                return res.status(400).json(`1 private root need ${res.type} to login`);
            }
      
    } catch(err) {
        res.locals.user = null;
        res.cookie('auth_token', '', { maxAge: 1 });
        return res.status(400).json(`2 private root need ${res.type} to login`);
    }
};