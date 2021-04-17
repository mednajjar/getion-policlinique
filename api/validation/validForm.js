const Joi = require('joi');

exports.register = data=>{

    const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password:Joi.string().min(6).required()
})
    return schema.validate(data)
}

exports.login = data=>{

    const schema = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(6).required()
})
    return schema.validate(data)
}

exports.registerMedcine = data=>{

    const schema = Joi.object({
    matricule: Joi.string().min(4).required(),
    nom: Joi.string().min(3).required(),
    prenom:Joi.string().min(3).required(),
    specialite:Joi.string().min(3).required(),
    consmax:Joi.number().required(),
})
    return schema.validate(data)
}