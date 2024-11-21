

const CheckRole = async (req, res, next) => {
    if (req.user.role !== "Organizer") {
        return res.status(403).json({ "error": "Unauthorized! only Organizer can manage the events" });
    }
    next();
}

module.exports = CheckRole;

