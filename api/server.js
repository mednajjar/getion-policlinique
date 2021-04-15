require('dotenv').config();
const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const homePage = require('./routes/indexRoute');
const port = process.env.PORT | process.env.MY_PORT;
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');

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

// myStore.sync();
app.use((req, res, next) => {
    res.locals.sid = false; 
    next();
});
app.use('/', homePage);

app.listen(port, ()=>console.log(`http://localhost:${port}`))