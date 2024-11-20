
const router = require("express").Router();
const validateJWT = require("../Middlewares/ValidateJWT");
const CheckRole = require("../Middlewares/CheckRole");
const {validateEvent} = require("../Middlewares/Validate");


const { GetEventsbasedOnUser,
    CreateEventBasedonUser,
    UpdateEventsBasedonUser,
    DeleteEventsBasedOnUser,
    GetallEvents,
    RegisterTheEventandNotify } = require("../Controllers/EventController");


    
//event Routes for Organizer//
router.get("/Getevents", validateJWT, CheckRole, GetEventsbasedOnUser);
router.post("/createEvents", validateJWT, CheckRole,validateEvent, CreateEventBasedonUser);
router.put('/updateEvent/:eventId', validateJWT, CheckRole,validateEvent, UpdateEventsBasedonUser);
router.delete('/deleteEvent/:eventId', validateJWT, CheckRole, DeleteEventsBasedOnUser);
//to display the events for the attendees to register//
router.get('/getAllEvents', validateJWT,GetallEvents);
// for event Registeration by attendee//
router.post('/:id/register', validateJWT,RegisterTheEventandNotify);


module.exports = router;