const joi = require("joi");
const { validate } = require("../Model/Usermodel");

const Registrationschema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$"))
        .required(),
    phone: joi.number(),
    role: joi.string().required(),
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});


const eventSchema = joi.object({
    event_name: joi.string().required(),
    event_description: joi.string().required(),
    event_date: joi.date().required(),
    event_time: joi.string().required(),
    organizerId: joi.string().required(), // Validates ObjectId as string
    participants: joi.array().items(joi.string()).optional() // Optional array of participant IDs
});

const ValidateErrors = (error, res, next) => {
    return res.status(400).json({ error: error.details[0].message });
}


const validateRegistration = (req, res, next) => {
    const { error } = Registrationschema.validate(req.body);
    if (error) {
        ValidateErrors(error, res, next);
    }
    next();
};
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        ValidateErrors(error, res, next);
    }
    next();
};

const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        ValidateErrors(error, res, next);
    }
    next();
};




module.exports = {
    validateRegistration,
    validateLogin,
    validateEvent
};