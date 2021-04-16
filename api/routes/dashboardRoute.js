const express = require('express');
const route = express.Router();
const {dashboard} = require('../controllers/homeController')
const {register, getReception, registerPage}= require('../controllers/adminController');
const {auth, authAdmin, authReception} = require('../middlewares/validateToken');
const {login, logout} = require('../controllers/auth');

route.get('/dashboard',(authAdmin || authReception), auth, dashboard)
route.get('/register',authAdmin , auth, registerPage)
// route.post('/register', authAdmin , auth, register)
route.get('/users',authAdmin , auth, getReception)
route.post('/dashboard', login)
route.get('/logout', logout)





module.exports = route;