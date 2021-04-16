const User = require('../models/User');
const {login} = require('../validation/validForm');
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
        // compare password user
        const match = await bcrypt.compare(password, Email.password);
        if(!match) return res.status(400).json({err: 'Invalid email or password'});
        req.session.id = Email._id;
        req.session.role = Email.role;
        console.log('from login',req.session.role)
        const token = jwt.sign({id: Email._id, role: Email.role}, process.env.TOKEN_SECRET, {expiresIn:process.env.EXPIRATION_IN});
        res.cookie('auth_token', token, {maxAge:process.env.EXPIRATION_IN, httpOnly: true})
        return res.status(200).render('dashboard', {role: Email.role});

    } catch (err) {
        res.status(400).json({error: 'bad request'});
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err)=>{
        if(err) throw err;
        res.clearCookie('connect.sid');
        res.cookie('auth_token', '', {maxAge: 0, httpOnly: true});
        res.status(200).redirect('/')
    })
    
}

