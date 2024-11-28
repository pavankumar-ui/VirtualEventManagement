jest.mock('../src/Model/Eventmodel.js');
jest.mock('../src/Model/Usermodel.js');
jest.mock('../src/Mail/RegisterNotify.js');

const { GetallEvents } = require('../src/Controllers/EventController.js');
const Event = require('../src/Model/Eventmodel.js');


describe('Events Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clears mocks to avoid state leakage
    });

    describe('GetallEvents', () => {
        it('should return 403 if user is not an attendee', async () => {
            const req = { user: { role: 'organizer' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await GetallEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith( {"error": "only attendees can view the events"} ); // Match your actual response
        });

        it('should return events for attendees', async () => {
            const req = { user: { role: 'attendee' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

                    Event.find.mockReturnValue({
                        populate: jest.fn().mockReturnThis(),
                        select: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue([{ event_name: 'Test Event' }])
                    });

            await GetallEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({ events: [{ event_name: 'Test Event' }] });
        });
    });


});
