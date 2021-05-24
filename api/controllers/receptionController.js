const Patient = require('../models/Patient');
const { registerPatient } = require('../validation/validForm');
const { findPatient, findAll, updatedEtat } = require('../functions/functions');
const Fawn = require('fawn');
const Medcine = require('../models/Medcine');
const Room = require('../models/Salle_attente');
const Consultation = require('../models/D_Consultation');

/**
 * 
 * @param {get reception role from session} req 
 * @param {render register reception page} res 
 */

exports.patientPage = async (req, res) => {
    const receptionRole = req.session.role;
    const medcin = await Medcine.find();
    res.render('patient', { role: receptionRole, medcin: medcin, msg: '' })
}

exports.patientListPage = async (req, res) => {
    await findAll(req, res, Patient, Consultation, Medcine)
}



/**
 * 
 * @param {validate form by joi} req 
 * @param {response result} res 
 * @returns {render register patient page }
 */

exports.createPatient = async (req, res) => {
    const medcine = await Medcine.find()
    const { error } = registerPatient(req.body);
    if (error) {
        return res.render('patient', { role: req.session.role, medcin: medcine, msg: error.details[0].message });
    }
    const d = new Date();
    const month = d.getMonth() + 1;
    const dt = d.getFullYear() + '-' + month + '-' + d.getDate();
    const findDate = await Room.findOne({ roomDate: dt })
    if (!findDate) {
        req.flash('error', 'Veuillez créer une salle d\'attente pour aujourd\'hui avant d\'ajouter un patient!')
        return res.render('patient', { role: req.session.role, medcin: medcine, msg: req.flash('error') });
    }
    try {
        const cinExist = await Patient.findOne({ cin: req.body.cin });
        if (cinExist) {
            req.flash('error', 'La CIN existe déjà!')
            return res.render('patient', { role: req.session.role, medcin: medcine, msg: req.flash('error') });
        }
        const selectedMedcine = await Medcine.findOne({ nom: req.body.name })
        if (selectedMedcine.patientmax > selectedMedcine.consmax) {
            req.flash('error', `Le nombre de consultation pour monsieur ${req.body.name} attiendre le maximum!, veuillez le contacter.`)
            return res.render('patient', { role: req.session.role, medcin: medcine, msg: req.flash('error') });
        }
        const patient = new Patient({
            ...req.body,
        })

        const dConsultation = new Consultation({
            id_patient: patient._id,
            id_medcine: selectedMedcine._id,
            id_salleAtt: findDate._id
        })
        dConsultation.save();
        const task = Fawn.Task();
        const taches = await task.save('Patient', patient)
            .update('Medcine', { _id: selectedMedcine._id }, { $inc: { patientmax: 1 } })
            .update('D_Consultation', { _id: dConsultation._id }, { $inc: { num_order: selectedMedcine.patientmax + 1 } })
            .run({ useMongoose: true })
        if (taches) {
            req.flash('error', 'Patient créer et ajouter au salle d\'attente')
            return res.render('patient', { role: req.session.role, medcin: medcine, msg: req.flash('error') });
        }

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

exports.findFunction = async (req, res) => {
    if (req.body.keyword) return await findPatient(res, Patient, req.body.keyword)
}

exports.salleAttPage = async (req, res) => {
    const receptionRole = req.session.role;
    const room = await Consultation.find()
        .populate('id_salleAtt')
        .populate('id_medcine')
        .populate('id_patient')

    if (room) {
        return res.render('salleAtt', { role: receptionRole, room: room, examiner: room.etat })
    }
}


exports.roomPage = async (req, res) => {
    const receptionRole = req.session.role;
    try {
        const room = await Room.find();
        if (room) res.render('room', { role: receptionRole, room: room, msg: '' })
    } catch (error) {
        throw Error(error)
    }



}


exports.newRoom = async (req, res) => {
    const receptionRole = req.session.role;

    try {
        const d = new Date();
        const month = d.getMonth() + 1;
        const dt = d.getFullYear() + '-' + month + '-' + d.getDate();

        const fetchRoom = await Room.find();
        const existRoom = await Room.findOne({ roomDate: dt });

        if (!existRoom) {
            const room = new Room();
            const newRoom = await room.save();
            if (newRoom)
                await Medcine.updateMany({ patientmax: 0 });
            req.flash('error', 'Vous avez créer nouveau salle d\'attente')
            return res.render('room', { role: receptionRole, room: fetchRoom, msg: req.flash('error') })

        } else {
            req.flash('error', 'Salle d\'attente existe déjà pour aujourd\'hui!');
            return res.render('room', { role: receptionRole, room: fetchRoom, msg: req.flash('error') })
        }


    } catch (error) {
        throw Error(error)
    }
}

exports.enCours = async (req, res) => {
    await updatedEtat(req, res, Consultation, 'en-cours')
}

exports.examiner = async (req, res) => {
    await updatedEtat(req, res, Consultation, 'examiner')
}

exports.findRoom = async (req, res) => {
    try {
        const receptionRole = req.session.role;
        const resultat = await Consultation.find({ etat: { $regex: '.*' + req.body.keyword + '.*' } })
            .populate('id_salleAtt')
            .populate('id_medcine')
            .populate('id_patient')
        if (resultat) return res.render('salleAtt', { role: receptionRole, room: resultat, examiner: resultat.etat })
    } catch (error) {
        throw Error(error)
    }
}

exports.rajouterPatient = async (req, res) => {

    const medcine = await Medcine.find();
    const patients = await Patient.find();
    const consPat = await Consultation.find();

    const d = new Date();
    const month = d.getMonth() + 1;
    const dt = d.getFullYear() + '-' + month + '-' + d.getDate();

    const findDate = await Room.findOne({ roomDate: dt })
    console.log(findDate)
    if (!findDate) {
        req.flash('error', 'Veuillez créer une salle d\'attente pour aujourd\'hui avant d\'ajouter un patient!')
        return res.render('rajouter', { role: req.session.role, patients: patients, medcin: medcine, examiner: consPat, msg: req.flash('error') });
    }
    try {
        console.log(req.params.id)
        console.log(req.body.name)
        const selectedMedcine = await Medcine.findOne({ nom: req.body.name })
        if (selectedMedcine.patientmax > selectedMedcine.consmax) {
            req.flash('error', `Le nombre de consultation pour monsieur ${req.body.name} attiendre le maximum!, veuillez le contacter.`)
            return res.render('rajouter', { role: req.session.role, patients: patients, medcin: medcine, examiner: consPat, msg: req.flash('error') });
        }


        const dConsultation = new Consultation({
            id_patient: req.params.id,
            id_medcine: selectedMedcine._id,
            id_salleAtt: findDate._id
        })
        dConsultation.save();
        const task = Fawn.Task();
        // const taches = await task.save('Patient', patient)
        task.update('Medcine', { _id: selectedMedcine._id }, { $inc: { patientmax: 1 } })
            .update('D_Consultation', { _id: dConsultation._id }, { $inc: { num_order: selectedMedcine.patientmax + 1 } })
            .run({ useMongoose: true })
        if (task) {
            req.flash('error', 'Patient créer et ajouter au salle d\'attente')
            return res.render('rajouter', { role: req.session.role, patients: patients, medcin: medcine, examiner: consPat, msg: req.flash('error') });
        }

    } catch (error) {
        throw Error(error)
    }
}

exports.rajouterPage = async (req, res) => {
    const medcine = await Medcine.find();
    const patients = await Patient.findById(req.params.id);
    return res.render('rajouter', { role: req.session.role, patients: patients, medcin: medcine, msg: '' });

}

