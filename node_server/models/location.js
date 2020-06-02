const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const locationSchema = new Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


var Loations = mongoose.model('Location', locationSchema);

module.exports = Loations;