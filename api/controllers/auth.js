const User = require('../models/User');
const {register, login} = require('../validation/validForm');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.login = async (req, res)=>{
   
    // check validaton
    const {error} = login(req.body);
    if(error) return res.status(400).json({err: error.details[0].message});
    const {email, password} = req.body;
    try {
        // check email user
        const Email =  await User.findOne({email});
        if(!Email)  return res.status(400).json({err: 'Invalid email or password'});
        console.log(Email.role)
        // compare password user
        const match = await bcrypt.compare(password, Email.password);
        if(!match) return res.status(400).json({err: 'Invalid email or password'});
        const token = jwt.sign({id: Email._id, role: Email.role}, process.env.TOKEN_SECRET, {expiresIn:process.env.EXPIRATION_IN});
        console.log(token)
        return res.status(200).cookie('auth_token', token, {maxAge:process.env.EXPIRATION_IN, httpOnly: true}).json({token});

    } catch (err) {
        res.status(400).json({error: 'bad request'});
    }
}

exports.logout = (req, res) => {
    res.cookie('auth_token', '', {maxAge: 0, httpOnly: true});
    res.status(200).json('loged out')  
}

