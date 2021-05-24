const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');
const { Schema, model } = mongoose;

const patientSchema = new Schema({
    nom: { type: String, require: true },
    prenom: { type: String, require: true },
    cin: { type: String, unique: true, require: true },
    dtns: { type: Date, require: true },
})

patientSchema.virtual('dateDeNaissance').get(function () {
    return moment(this.dtns).format('DD/MM/YYYY');
})

patientSchema.plugin(uniqueValidator);
module.exports = model('Patient', patientSchema)

