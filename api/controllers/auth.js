const User = require('../models/User');
const { login } = require('../validation/validForm');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.login = async (req, res) => {
    const { email, password } = req.body;

    // check validaton
    const { error } = login(req.body);
    if (error) {
        return res.render('index', { msg: error.details[0].message, email: email, pass: password });
    }
    try {
        // check email user
        const Email = await User.findOne({ email });
        if (!Email) {
            req.flash('error', 'Invalid email or password');
            return res.render('index', { msg: req.flash('error'), email: email, pass: password });
        }
        // compare password user
        const match = await bcrypt.compare(password, Email.password);
        if (!match) {
            req.flash('error', 'Invalid email or password');
            return res.render('index', { msg: req.flash('error'), email: email, pass: password });
        }
        req.session.id = Email._id;
        req.session.role = Email.role;
        const userRl = req.session.role;
        const token = jwt.sign({ id: Email._id, role: Email.role }, process.env.TOKEN_SECRET, { expiresIn: process.env.EXPIRATION_IN });
        console.log(token)
        res.cookie('auth_token', token, { maxAge: process.env.EXPIRATION_IN, httpOnly: true })
        return res.status(200).render('dashboard', { role: userRl, msg: req.flash('error') });

    } catch (err) {
        res.status(400).json({ error: 'bad request' });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.clearCookie('connect.sid');
        res.cookie('auth_token', '', { maxAge: 0, httpOnly: true });
        res.status(200).redirect('/')
    })

}

