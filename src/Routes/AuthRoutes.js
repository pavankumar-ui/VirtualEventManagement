const express = require("express");
const router = express.Router();
const ValidateJWT = require("../Middlewares/ValidateJWT");
const {validateRegistration,
    validateLogin} = require("../Middlewares/Validate");
const {SignupUser,SigninUser,getProfile} = require("../Controllers/AuthController");

/*const secret = crypto.randomBytes(32).toString("base64");*/


router.post("/register",validateRegistration,SignupUser);
router.post("/login",validateLogin,SigninUser);

//distinguishing between Organizer and Attendee, where user is logged in to view his profile//
router.get("/profile", ValidateJWT, getProfile)

module.exports = router;