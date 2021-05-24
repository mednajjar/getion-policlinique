const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose;

const d = new Date();
const month = d.getMonth() + 1;
const dt = d.getFullYear() + '-' + month + '-' + d.getDate();

const salleSchema = new Schema({
    roomDate: { type: Date, default: dt },
})

salleSchema.virtual('aujourdhui').get(function () {
    return moment(this.roomDate).format('YYYY-MM-DD');
})

salleSchema.plugin(uniqueValidator);
module.exports = model('SalleAtt', salleSchema)

