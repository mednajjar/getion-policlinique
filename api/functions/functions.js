// exports.findPatientByDt = async (res, model, value) =>{
   
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

exports.findAll = async (req, res, model)=>{
    const receptionRole = req.session.role;
    try {
    
        const patients = await model.find();
        if(patients) res.render('patientList', {role: receptionRole, patients: patients}) 
    } catch (error) {
        throw Error(error)
    }
}