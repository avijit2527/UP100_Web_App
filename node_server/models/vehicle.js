
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const locationSchema = new Schema({
    timeSlot: {
        type: Date,   
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
})


const vehicleSchema = new Schema({
    vehicleId: {
        type: String,
        unique: true,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    timeSlot:  {
        type: Date,
        required: true
    },
    locations: [locationSchema]
}, {
    timestamps: true
});


var Vehicles = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicles;