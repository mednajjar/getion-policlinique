const Patient = require('../models/Patient');
const {registerPatient} = require('../validation/validForm');
const {findPatient, findAll} = require('../functions/functions');
const Fawn = require('fawn');
const Medcine = require('../models/Medcine');
const Room = require('../models/Salle_attente');
const Consultation = require('../models/D_Consultation');

/**
 * 
 * @param {get reception role from session} req 
 * @param {render register reception page} res 
 */

 exports.patientPage = async (req, res)=>{
    const receptionRole = req.session.role;
    const medcin = await Medcine.find();
    res.render('patient', {role: receptionRole, medcin: medcin}) 
}

 exports.patientListPage = async (req, res)=>{
    await findAll(req, res, Patient)
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

    // const today = new Date().toISOString().slice(0, 10)
    // console.log(today)
    const findDate = await Room.findOne({aujourdhui: Date.now })
    console.log(findDate)
    if(!findDate) return res.status(400).json('You sould create room first!')
    // si nouvelle date update le nombre consultation
    /**
     * 
     */
    try {
        const cinExist = await Patient.findOne({cin: req.body.cin});
        if(cinExist) return res.status(400).json('Cin already exist!');

        const medcine = await Medcine.find()
        const selectedMedcine = await Medcine.findOne({nom: req.body.name})
        console.log(selectedMedcine)
        if(selectedMedcine.patientmax >= selectedMedcine.consmax) return res.statue(400).json('le nombre de consultation attiendre le maximum')
        const patient = new Patient({
            ...req.body,
        })
        
        const dConsultation = new Consultation({
            id_patient: patient._id,
            id_medcine: selectedMedcine._id,
            id_salleAtt: findDate._id
        })
        dConsultation.save();
        const task =  Fawn.Task();
        const taches = await task.save('Patient', patient)
        .update('Medcine',{_id: selectedMedcine._id},{$inc:{patientmax: 1}})
        .update('D_Consultation',{_id: dConsultation._id},{$inc:{num_order: selectedMedcine.patientmax + 1}})
        .run({ useMongoose: true })
        if (taches) return res.status(200).render('patient', {role: req.session.role, medcin: medcine});
        // const newPatient = await patient.save();
        // if(newPatient) return res.status(200).render('patient', {role: req.session.role, medcin: medcine});
        
    } catch (error) {
        throw Error(error)
    }
}

/**
 * 
 * @param {search by keyword} req 
 * @param {render patient list page } res 
 * @returns {result by regex operator }
 */

exports.findFunction = async (req, res)=>{
    if(req.body.keyword) return await findPatient(res, Patient, req.body.keyword)
}

exports.salleAttPage = async (req, res)=>{
    const receptionRole = req.session.role;
    res.render('salleAtt', {role: receptionRole}) 
}


exports.roomPage = async (req, res)=>{
    const receptionRole = req.session.role;
    try {
        const room = await Room.find();
        if(room) res.render('room', {role: receptionRole, room: room}) 
    } catch (error) {
        throw Error(error)
    }
}


exports.newRoom = async (req, res)=>{
    const receptionRole = req.session.role;
    
    try {
        const fetchRoom = await Room.find();
        const ExistRoom = await Room.findOne({aujourdhui: fetchRoom.aujourdhui});
        if(ExistRoom) return res.status(400).json('room already created');
        
        const room = new Room();
        const newRoom = await room.save();
        if(newRoom) return res.render('room', {role: receptionRole, room: fetchRoom})
        
    } catch (error) {
        throw Error(error)
    }
}

