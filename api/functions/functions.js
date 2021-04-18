exports.findPatientByDt = async (res, model, value) =>{
   
    try {
        const variable = await model.find({dtns: value});
        if(variable){
            return res.status(201).json({variable}) 
        }else{
            return res.status(400).json('no data found')
        }
        
    } catch (error) {
        throw Error(error)
    }
}

exports.findPatientByName = async (res, model, value) =>{
   
    try {
        const variable = await model.find({nom: value});
        if(variable){
            return res.status(201).json({variable}) 
        }else{
            return res.status(400).json('no data found')
        }
        
    } catch (error) {
        throw Error(error)
    }
}
exports.findPatientByCin = async (res, model, value) =>{
   
    try {
        const variable = await model.find({cin: value});
        if(variable){
            return res.status(201).json({variable}) 
        }else{
            return res.status(400).json('no data found')
        }
        
    } catch (error) {
        throw Error(error)
    }
}