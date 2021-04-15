const express = require('express');
const route = express.Router();
const {homePage} = require('../controllers/homeController')
const {login, logout} = require('../controllers/auth');
const {register, getReception}= require('../controllers/adminController');
const {auth, authAdmin, authReception} = require('../middlewares/validateToken');

route.get('/', homePage)
route.post('/register', authAdmin , auth, register)
route.get('/users',authAdmin , auth, getReception)
route.get('/logout', logout)
route.post('/login', login)


module.exports = route;