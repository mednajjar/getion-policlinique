const User = require('../models/User');
const Medcine = require('../models/Medcine');
const { register, registerMedcine } = require('../validation/validForm');
const bcrypt = require('bcrypt');

/**
 * 
 * @param {validate form by joi} req 
 * @param {response result} res 
 * @returns {vers register reception page }
 */

exports.register = async (req, res) => {
    const { error } = register(req.body);
    if (error) return res.status(400).json({ err: error.details[0].message });

    const { email, password } = req.body;
    const hashPass = await bcrypt.hash(password, 12);

    try {
        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(400).json('email already exist!');
        const user = new User({
            ...req.body
        })
        user.password = hashPass;
        const newUser = await user.save();
        if (newUser) return res.status(200).render('register', { role: req.session.role });

    } catch (error) {
        throw Error(error)
    }


}

/**
 * 
 * @param {validate form by joi} req 
 * @param {response result} res 
 * @returns {vers register medcine page }
 */

exports.registerMedcine = async (req, res) => {
    const { error } = registerMedcine(req.body);
    if (error) return res.status(400).json({ err: error.details[0].message });

    try {
        const matExist = await Medcine.findOne({ matricule: req.body.matricule });
        if (matExist) return res.status(400).json('Matricule already exist!');
        const medcine = new Medcine({
            ...req.body
        })
        const newMedcine = await medcine.save();
        if (newMedcine) return res.status(200).render('medcine', { role: req.session.role });

    } catch (error) {
        throw Error(error)
    }


}

/**
 * 
 * @param {get all registred reception} find
 * @param {render receptin list page} res 
 */

exports.getReception = async (req, res) => {
    try {
        const users = await User.find({ role: 'reception' }).select('-password');
        if (users) res.render('users', { users: users })
    } catch (error) {
        throw Error(error)
    }
}

/**
 * 
 * @param {get all registred medcine} find
 * @param {render medcine list page} res 
 */

exports.getMedcine = async (req, res) => {
    try {
        const medcines = await Medcine.find();
        if (medcines) res.render('medcineList', { medcines: medcines })
    } catch (error) {
        throw Error(error)
    }
}

/**
 * 
 * @param {get admin role from session} req 
 * @param {render register reception page} res 
 */

exports.registerPage = async (req, res) => {
    const adminRole = req.session.role;
    res.render('register', { role: adminRole })
}

/**
 * 
 * @param {request user role from session} req 
 * @param {render dashboard with user role} res 
 */

exports.dashboard = (req, res) => {
    const userRole = req.session.role;
    res.render('dashboard', { role: userRole })
}

/**
 * 
 * @param {request admin role from session} req 
 * @param {render medcine page with admin role} res 
 */

exports.medcinePage = async (req, res) => {
    const adminRole = req.session.role;
    res.render('medcine', { role: adminRole })

}

/**
 * 
 * @param {request admin role} req 
 * @param {get reception list} find 
 * @param {render reception page list with all users} res 
 */

exports.deleteUser = async (req, res) => {
    try {
        const adminRole = req.session.role;
        const deleteUser = await User.findByIdAndDelete(req.params.id)
        const users = await User.find({ role: 'reception' }).select('-password');
        if (deleteUser) res.status(201).render('users', { role: adminRole, users: users })

    } catch (error) {
        throw Error(error)
    }
}

/**
 * 
 * @param {request admin role} req 
 * @param {find medcine by id nd delete} find 
 * @param {get all medcines} find 
 * @param {render medcine page list} res 
 */

exports.deleteMedcine = async (req, res) => {
    try {
        const adminRole = req.session.role;
        const deleteMedcine = await Medcine.findByIdAndDelete(req.params.id)
        const medcines = await Medcine.find();
        if (deleteMedcine) res.status(201).render('medcineList', { role: adminRole, medcines: medcines })

    } catch (error) {
        throw Error(error)
    }
}
