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
            if(userLog){
                if(userLog.role == res.type){
                    const user = await User.findById(userLog.id).select('-password');
                    req.session.role = user.role;
                    console.log('from valid token',req.session.role) 
                    res.render('dashboard', {role: req.session.role})        
                next();

                }
              
            }else{
                return res.status(400).json(`1 private root need ${res.type} to login`);
            }
      
    } catch(err) {
        res.clearCookie('connect.sid');
        res.cookie('auth_token', '', {maxAge: 0, httpOnly: true});
        res.status(200).redirect('/')
    }
};