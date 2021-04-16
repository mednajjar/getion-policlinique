require('dotenv').config();
const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const homePage = require('./routes/indexRoute');
const dashboard = require('./routes/dashboardRoute');
const port = process.env.PORT | process.env.MY_PORT;
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const session = require('express-session');

mongoose.connect(process.env.CON_DB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('connection success'))
.catch(()=>console.log('connection failed!'))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
mongoose.set('useCreateIndex', true);
app.use(express.static(path.join(__dirname, 'public')))
app.use(ejsLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs')


app.use(
    session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
})
);
// myStore.sync();
app.use((req, res, next) => {
    res.locals.role = req.session.role; 
    console.log('from server',res.locals.role)
    next();
});
app.use('/', homePage);
app.use('/', dashboard);
// the last middleware should be 404 page
app.use((req, res)=>{
    res.status(404).render('404')
})

app.listen(port, ()=>console.log(`http://localhost:${port}`))