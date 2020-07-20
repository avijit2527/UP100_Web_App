
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const zoneSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    zone:  {
        type: String,
        required: true
    },
    leftLat: {
        type: Number,
        required: true
    },
    leftLng: {
        type: Number,
        required: true
    },
    rightLat: {
        type: Number,
        required: true
    },
    rightLng: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});


var Zones = mongoose.model('Zone', zoneSchema);

module.exports = Zones;