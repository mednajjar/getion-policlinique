const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const consultationSchema = new Schema({
    id_patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
    id_medcine: { type: Schema.Types.ObjectId, ref: 'Medcine' },
    id_salleAtt: { type: Schema.Types.ObjectId, ref: 'SalleAtt' },
    num_order: { type: Number, default: 0 },
    etat: { type: String, enum: ['en-attente', 'examiner', 'en-cours'], default: 'en-attente' },
})

module.exports = model('D_Consultation', consultationSchema)