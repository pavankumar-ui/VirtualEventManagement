
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


    
// Adjusted routes in `eventRoutes`
router.get("/", validateJWT, CheckRole, GetEventsbasedOnUser); // Fetch events for a user
router.post("/", validateJWT, CheckRole, validateEvent, CreateEventBasedonUser); // Create a new event
router.put("/:eventId", validateJWT, CheckRole, validateEvent, UpdateEventsBasedonUser); // Update an event
router.delete("/:eventId", validateJWT, CheckRole, DeleteEventsBasedOnUser); // Delete an event
router.get("/available", validateJWT, GetallEvents); // List available events for attendees
router.post("/:id/register", validateJWT, RegisterTheEventandNotify); // Register for an event



module.exports = router;