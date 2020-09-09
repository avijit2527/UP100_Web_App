
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const nearestLocationSchema = new Schema({    
    zone: {
        type: String,
        required: true
    },
    location: {
        type: { type: String },
        coordinates: []
     }
}, {
    timestamps: true
});

nearestLocationSchema.index({ location: "2dsphere" });
var NearestLocations = mongoose.model('NearestLocation', nearestLocationSchema);

module.exports = NearestLocations;