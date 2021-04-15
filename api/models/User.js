const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username:{type: String, max:20, require:true},
    email:{type: String, unique:true, require: true},
    role:{type:String, enum:['admin', 'reception'], default: 'reception'},
    password:{type:String, required:true}
})
userSchema.plugin(uniqueValidator);
module.exports = model('User', userSchema)