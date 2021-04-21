const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const {Schema, model} = mongoose;

const salleSchema = new Schema({
    roomDate:{type: Date, unique: true, default: Date.now},   
})

salleSchema.virtual('aujourdhui').get(function(){
    return moment(this.roomDate).format('DD/MM/YYYY');
})

salleSchema.plugin(uniqueValidator);
module.exports = model('SalleAtt', salleSchema)

