const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {Schema, model} = mongoose;

const medcineSchema = new Schema({
    matricule:{type: String, unique:true, require:true},
    nom:{type: String, require: true},
    prenom:{type: String, require: true},
    specialite:{type: String, require: true},
    consmax:{type: Number, require: true},   
})
medcineSchema.plugin(uniqueValidator);
module.exports = model('Medcine', medcineSchema)