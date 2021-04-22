// exports.findPatientByDt = async (res, model, value) =>{

const D_Consultation = require("../models/D_Consultation");

   
//     try {
//         await model.find({dtns: value},
//             function(err, result) {
//               if (err) {
//                 res.send(err);
//               } else {
//                 res.send(result);
//               }
//             });
        
        
//     } catch (error) {
//         throw Error(error)
//     }
// }

exports.findPatient = async (res, model, value) =>{

    try {
        const resultat = await model.find({$or: [{nom: { $regex: '.*' + value + '.*' }},{prenom: { $regex: '.*' + value + '.*' }},{cin: { $regex: '.*' + value + '.*' }}] });
        if(resultat) return res.render('patientList', {patients: resultat}) 
    } catch (error) {
        throw Error(error)
    }
}

exports.findAll = async (req, res, model, model2, model3)=>{
    const receptionRole = req.session.role;
    try {
    
        const patients = await model.find()
        const consPat = await model2.find();
        const medcine = await model3.find();  
        if(patients) res.render('patientList', {role: receptionRole, patients: patients,medcin: medcine, examiner: consPat, msg: ''}) 
    } catch (error) {
        throw Error(error)
    }
}

exports.updatedEtat = async (req, res, model, value)=>{
    const receptionRole = req.session.role;
    const updateEtat = await model.findByIdAndUpdate({_id: req.params.id},{etat: value})
    if(updateEtat){
        const room = await model.find()
        .populate('id_salleAtt')
        .populate('id_medcine')
        .populate('id_patient')
        
        return res.render('salleAtt', {role: receptionRole, room: room})
    }
}

