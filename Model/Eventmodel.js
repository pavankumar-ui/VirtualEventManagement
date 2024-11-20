const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

    event_name: {
        type: String,
        required: true
    },
    event_description: {
        type: String,
        required: true
    },
    event_date: {
        type: Date,
        required: true
    },
    event_time: {
        type: String, // Time in HH:MM format (alternative could be Date type with combined date/time if desired)
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Regex for HH:MM format
    },
    participants:[{
        type: mongoose.Schema.Types.ObjectId,  //Attendees user role will be added//
        ref:"User"
    }],
    organizerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;