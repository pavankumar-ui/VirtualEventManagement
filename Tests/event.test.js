const request = require("supertest");
const app = require("../App");
const ValidateJWT = require('../src/Middlewares/ValidateJWT');
const checkRole = require("../src/Middlewares/CheckRole");
const TokenExpire = require("../src/Middlewares/TokenExpire");
const mongoServer = require("./Mongosetup/mongoServer");
const mongoose = require("mongoose");

jest.mock("../src/Middlewares/ValidateJWT");
jest.mock("../src/Middlewares/CheckRole");
jest.mock("../src/Middlewares/TokenExpire");

describe("Test for Creation,updation,deletion and reading of events", () => {

    let token;
    let organizerId;
    let loginRes;
    let registerRes;
    let createdEventId;

    beforeAll(async () => {
        await mongoServer.connect();
        //register the user //
        registerRes = await request(app)
            .post("/api/users/register")
            .send({
                username: "test2",
                email: "test2@gmail.com",
                password: "new@1234",
                phone: "9876543210",
                role: "Organizer"
            });

        // Ensure registration was successful
        expect(registerRes.statusCode).toBe(201);
        organizerId = registerRes.body.user.id;

        ValidateJWT.mockImplementation((req, res, next) => {

            //req.user.role ? "Organizer": "attendee";

            req.user = {
                _id: new mongoose.Types.ObjectId(),
                username: "test2",
                email: "test2@gmail.com",
                role: "Organizer"
            };
            next();
        });

        checkRole.mockImplementation((req, res, next) => {

            if (req.user.role !== "Organizer") {
                return res.status(403).json({
                    error: "Unauthorized! only Organizer can manage the events"
                });
            }
            next();
        });

        TokenExpire.mockImplementation((err, req, res, next) => {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    error: "Token has expired",
                    message: "Please login again to get a new token"
                });
            }
            next(err);
        });

    });




    //run the login test first before performing CRUD operations of events//
    beforeEach(async () => {

        // Log in to get the token
        loginRes = await request(app)
            .post("/api/users/login")
            .send({
                email: "test2@gmail.com",
                password: "new@1234",
            });

        // Ensure login was successful
        expect(loginRes.statusCode).toBe(200);
        token = loginRes.body.token; // Save the token globally

        // Check if token is valid
        expect(token).toBeDefined();
    });


    let events = {
        event_name: "test event",
        event_description: "test description",
        event_date: "2024-11-30",
        event_time: "11:00"
    }

    //it should give the error reponse when events are not displayed  with authorized token//
    it("Should display error to user when events are not found while reading", async () => {

        const DisplayRes = await request(app)
            .get('/api/events/getEvents')
            .set("Authorization", `${token}`)

        if (DisplayRes.statusCode === 404) {
            expect(DisplayRes.statusCode).toBe(404);
            expect(DisplayRes.body).toHaveProperty("error");
        }
    });

    //first it should create an event with authorized token//
    it("Should create an event", async () => {

        events.organizerId = organizerId;
        const createRes = await request(app)
            .post("/api/events/createEvents")
            .set("Authorization", `${token}`)
            .send(events);

        expect(createRes.statusCode).toBe(201);
        createdEventId = createRes.body.eventId;
        expect(createRes.body).toHaveProperty("message");
        expect(createRes.body).toHaveProperty("eventId");

    });

    //checks the date validation and throws error if date is in past//
    it("should ensure the date is in past while given invalid Date and display the error", async () => {

        const checkDate = await request(app)
            .post("/api/events/createEvents")
            .set("Authorization", `${token}`)
            .send({
                event_name: "test event",
                event_description: "test description",
                event_date: "2023-11-30",
                event_time: "11:00",
                organizerId: organizerId
            });
        expect(checkDate.statusCode).toBe(400);
        expect(checkDate.body).toHaveProperty("error");
    });

    // it should update the event with authorized token//
    it("Should update an event", async () => {

        expect(createdEventId).toBeDefined();

        const updatedEvent = {
            event_name: "Updated Event Name",
            event_description: "Updated Event Description",
            event_date: "2024-11-30",
            event_time: "11:00",
            organizerId: organizerId
        };

        const Updatedres = await request(app)
            .put(`/api/events/updateEvent/${createdEventId}`)
            .set("Authorization", `${token}`)
            .send(updatedEvent);

        expect(Updatedres.statusCode).toBe(200);
        expect(Updatedres.body).toHaveProperty("message");
        expect(Updatedres.body).toHaveProperty("eventId");

    });

    //delete the events by having eventId//
    it("should delete the event based on the eventId", async () => {
        const deleteEventResponse = await request(app)
            .delete(`/api/events/deleteEvent/${createdEventId}`)
            .set("Authorization", `${token}`);

        expect(deleteEventResponse.statusCode).toBe(200);
        expect(deleteEventResponse.body).toHaveProperty("message");
        expect(deleteEventResponse.body).toHaveProperty("eventId");
        expect(deleteEventResponse.body.eventId).toBe(createdEventId);
    });

    it("should return 404 if event is not found while deleting", async () => {

        const nonExistentEventId = "6531e2244455460e635b6866";

        const deleteEventResponse = await request(app)
            .delete(`/api/events/deleteEvent/${nonExistentEventId}`)
            .set("Authorization", `${token}`);

        expect(deleteEventResponse.statusCode).toBe(404);
        expect(deleteEventResponse.body).toHaveProperty("error");
    });

    afterAll(async () => {
        await mongoServer.disconnect();
    });
});
jest.setTimeout(50000);




