const mongoose = require('mongoose');

const TripInfoSchema = new mongoose.Schema({


    email:{
        type: String,
        required: false
    },
    weight: {
        type: Number,
        required: true
    },
    from_location: {
        type: String,
        required: true
    },
    from_date: {
        type: Intl,
        required: true
    },
    to_location: {
        type: String,
        required: true
    },
    to_date: {
        type: Intl,
        required: true
    },
    observations: {
        type: String,
        required: true
    },
    capacity_volume: {
        type: String,
        required: true
    },
    transport: {
        type: String,
        required: true
    }
    
});

module.exports = TripInfoSchema;