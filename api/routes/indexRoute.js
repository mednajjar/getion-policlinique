const express = require('express');
const index = express.Router();
const {homePage} = require('../controllers/homeController')

index.get('/', homePage)



module.exports = index;