import mongoose from 'mongoose'

const madicalRecordSchema = new mongoose.Schema({

}, {timestamps: true})

export const MedicalRecord = mongoose.model('MedicalRecord', madicalRecordSchema);