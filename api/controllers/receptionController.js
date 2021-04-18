const Patient = require('../models/Patient');
const {registerPatient} = require('../validation/validForm');
const {findPatientByCin, findPatientByDt, findPatientById, findPatientByName} = require('../functions/functions')

/**
 * 
 * @param {get reception role from session} req 
 * @param {render register reception page} res 
 */

 exports.patientPage = async (req, res)=>{
    const receptionRole = req.session.role;
    res.render('patient', {role: receptionRole}) 
}

/**
 * 
 * @param {validate form by joi} req 
 * @param {response result} res 
 * @returns {render register patient page }
 */

 exports.createPatient = async (req, res)=>{
    const {error} = registerPatient(req.body);
    if(error) return res.status(400).json({err: error.details[0].message});

    try {
        const cinExist = await Patient.findOne({cin: req.body.cin});
        if(cinExist) return res.status(400).json('Cin already exist!');
        const patient = new Patient({
            ...req.body
        })
        const newPatient = await patient.save();
        if(newPatient) return res.status(200).render('patient', {role: req.session.role});
        
    } catch (error) {
        throw Error(error)
    }
}



exports.findFunction = async (req, res)=>{
    const {cin, nom, date}= req.body;
    if(cin) return await findPatientByCin(res, Patient, req.body.cin);
    if(date) return await findPatientByDt(res, Patient, req.body.date);
    if(nom) return await findPatientByName(res, Patient, req.body.nom);
}

/**
 * 
 * @param {get all registred patient} find
 * @param {render patient list page} res 
 */

 exports.getPatient = async (req, res) =>{
    try {
        const patients = await Patient.find();
        if(patients) res.render('patientList', {patients: patients})     
    } catch (error) {
        throw Error(error)
    }
}

