const express = require('express');
const route = express.Router();

const { register, getReception, registerPage, dashboard, deleteUser, medcinePage, registerMedcine, getMedcine, deleteMedcine } = require('../controllers/adminController');
const { createPatient, patientPage, findFunction, patientListPage, salleAttPage, roomPage, newRoom, enCours, examiner, findRoom, rajouterPatient, rajouterPage } = require('../controllers/receptionController');
const { auth, authAdmin, authReception } = require('../middlewares/validateToken');
const { login, logout } = require('../controllers/auth');

route.get('/dashboard', (authAdmin || authReception), auth, dashboard)
// ********Admin routes**************
route.get('/register', registerPage)
route.post('/register', register)
route.get('/users', getReception)
route.post('/users/:id', deleteUser)
route.get('/medcine', medcinePage)
route.post('/addmed', registerMedcine)
route.get('/medcineList', getMedcine)
route.post('/medcineList/:id', deleteMedcine)

// ******reception routes***********
route.get('/patient', patientPage)
route.post('/patient', createPatient)
route.get('/patientList', patientListPage)
route.post('/patientList', findFunction)
route.post('/patientList/:id', rajouterPatient)
route.get('/rajouter/:id', rajouterPage)
route.get('/salleAtt', salleAttPage)
route.get('/room', roomPage)
route.post('/room', newRoom)
route.post('/salleAtt/:id/en-cours', enCours)
route.post('/salleAtt/:id/examiner', examiner)
route.post('/salleAtt', findRoom)



route.post('/dashboard', login)
route.get('/logout', logout)





module.exports = route;