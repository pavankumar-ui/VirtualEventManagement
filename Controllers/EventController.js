const Event = require("../Model/Eventmodel");
const User = require("../Model/Usermodel");
const { CommonServerError } = require("../Utils/ServerError");
const transporter = require("../Mail/RegisterNotify");



const GetEventsbasedOnUser = async (req, res, next) => {

    try {

        //display the events based on the user loggedin (Organizer)//
        const events = await Event.find({ organizerId: req.user._id });
        if (events.length === 0) {
            return res.status(404).json({ "error": "No events found, create the event!" });
        }
        res.status(200).json({ events });
    }
    catch (err) {
        CommonServerError(err, req, res, next);
    }
}

const CreateEventBasedonUser = async (req, res, next) => {

    try {

        const body = req.body;
        body.organizerId = req.user._id;
        const event = await Event.create(body);
        res.status(201).json({
            message: "Event Created Successfully",
            eventId: event._id
        });

    } catch (err) {
        CommonServerError(err, req, res, next);
    }
}

const UpdateEventsBasedonUser = async (req, res, next) => {

    try {


        const Updateevent = await Event.findById(req.params.eventId);
        //console.log(Updateevent);

        Updateevent.event_name = req.body.event_name;
        Updateevent.event_description = req.body.event_description;
        Updateevent.event_date = req.body.event_date;
        Updateevent.event_time = req.body.event_time;

        await Updateevent.save();
        res.status(200).json({
            message: "Event Updated Successfully",
            eventId: Updateevent._id
        });

    } catch (err) {
        CommonServerError(err, req, res, next);
    }

}

const DeleteEventsBasedOnUser = async (req, res, next) => {

    try {

        const DeleteEvent = await Event.findByIdAndDelete(req.params.eventId);
        console.log('deleted Event:', DeleteEvent);

        res.status(200).json({
            message: "Event Deleted Successfully",
            eventId: DeleteEvent._id
        });
    }
    catch (err) {
        CommonServerError(err, req, res, next);
    }
}

//to register the events by Attendee//
const GetallEvents = async (req, res, next) => {

    try {

        if (req.user.role !== "attendee") {
            return res.status(403).json({ "error": "only attendees can view the events" });
        }

        //to hide the id  and display the username details to the other users for security purposes//
        const events = await Event.find()
            .populate('organizerId', 'username -_id')
            .populate('participants', 'username -_id')
            .select('-organizerId')
            .exec();

        return res.status(200).json({ events });
    }
    catch (err) {
        CommonServerError(err, req, res, next);
    }
}

const RegisterTheEventandNotify = async (req, res, next) => {

    try {
        const eventid = req.params.id;
        const event = await Event.findById(eventid);
        const user = await User.findById(req.user._id);


        const OrganizerEmail = await event.populate('organizerId'); //from address emailId//
        const AttendeeEmail = await user.populate('email');   //to address emailId//
        const Event_name = event.event_name;
        const Event_date = event.event_date;
        const Event_time = event.event_time;
        const Event_description = event.event_description;
        const Attendee_name = user.username;
        //console.log(OrganizerEmail.organizerId.email);
        //console.log(AttendeeEmail.email);
        //console.log(user);


        //check whether the user is attendee or not//
        if (req.user.role !== "attendee") {
            return res.status(403).json({ "error": "Only attendee can register the events" });
        }

        if (event === null) {
            return res.status(404).json({ "error": "Event not found" });
        }


        if (event.participants.some(participant => participant.equals(user._id)) === true) {
            return res.status(403).json({ "error": "event Already Registered" });
        }

        event.participants.push(user);
        event.save();

        //send email to the Attendee// 
        transporter.sendMail(
            {
                from: OrganizerEmail.organizerId.email,
                to: AttendeeEmail.email,
                subject: `Event ${Event_name}  is registered successfully`,
                html: `<p>Hello,</p>

                    <h3>${Attendee_name},</h3>
                     <p>Thank you for accepting the invite to <strong>${Event_name}</strong>.</p>
                     <p>We are eagerly waiting for your presence! Below are the details of the event:</p>
                      <hr>
                         <p>
                          <strong>Event Description<strong>:<p>${Event_description}</p><br>
                           <strong>Date:</strong> ${Event_date}<br>
                            <strong>Time:</strong> ${Event_time}
                             </p>
                             <p>Looking forward to seeing you there!</p>`

            },
            function (error, info) {
                if (error) {
                    console.log('Error:', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        //send the mail to the user to notify registered event invite//
        return res.status(200).json({
            "message": "Event Registered Successfully! Check your Mail for the details",
            "eventId": event._id
        });
    }

    catch (err) {
        CommonServerError(err, req, res, next);
    }
}

module.exports = {
    GetEventsbasedOnUser,
    CreateEventBasedonUser,
    UpdateEventsBasedonUser,
    DeleteEventsBasedOnUser,
    GetallEvents,
    RegisterTheEventandNotify
};