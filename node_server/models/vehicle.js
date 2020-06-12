
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
        type: Number,
        required: true
    },
    draggable: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


var Vehicles = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicles;