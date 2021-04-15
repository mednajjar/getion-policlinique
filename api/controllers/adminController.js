const User = require('../models/User');
const {register} = require('../validation/validForm');
const bcrypt = require('bcrypt');


exports.register = async (req, res)=>{
    const {error} = register(req.body);
    if(error) return res.status(400).json({err: error.details[0].message});

    const {email, password} = req.body;
    const hashPass = await bcrypt.hash(password, 12);

    try {
        const emailExist = await User.findOne({email});
        if(emailExist) return res.status(400).json('email already exist!');
        const user = new User({
            ...req.body
        })
        user.password = hashPass;
        const newUser = await user.save();
        if(newUser) res.status(200).json('user created');
    } catch (error) {
        throw Error(error)
    }


}

exports.getReception = async (req, res) =>{
    try {
        const users = await User.find();
        if(users) return res.status(201).json({users})
    } catch (error) {
        throw Error(error)
    }
}