
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const crimeSchema = new Schema({
    eventId: {
        type: String,
        unique: true,
        required: true
    },
    crimeTime:  {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    region: {
        type: String,
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
}, {
    timestamps: true
});


var Crimes = mongoose.model('Crime', crimeSchema);

module.exports = Crimes;