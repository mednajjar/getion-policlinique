require('dotenv').config();
const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const homePage = require('./routes/indexRoute');
const port = process.env.PORT | process.env.MY_PORT;
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(ejsLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs')

// myStore.sync();
app.use((req, res, next) => {
    res.locals.sid = false; 
    next();
});
app.use('/', homePage);

app.listen(port, ()=>console.log(`http://localhost:${port}`))