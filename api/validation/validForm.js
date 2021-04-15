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