const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const locationSchema = new Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


var Loations = mongoose.model('Location', locationSchema);

module.exports = Loations;