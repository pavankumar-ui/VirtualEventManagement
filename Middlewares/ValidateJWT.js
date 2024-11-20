const jwt = require("jsonwebtoken");
const User = require("../Model/Usermodel");

const ValidateJWT = async (req, res, next) => {
    const headers = req.headers || {} ;
    const token = headers.authorization;
     //|| headers.authorization.replace("Bearer ", "");

    if (!token) {
        return res.status(499).json({ "error": "Token not found" });
    }

    try {
        /*console.log("Token:", token); // Debugging the token
        /*console.log("JWT Secret in Middleware:", process.env.JWT_SECRET); */ // Check secret*/

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        /*console.log("Decoded token:", decoded); */ // Debug decoded info */

        const user = await User.findById(decoded.id);
        /*console.log("User found:", user);*/
        if (!user) {
            return res.status(498).json({ "error": "Invalid Token" });
        }
        // Attach user data to the request object
        req.user = user;
        next();
    }
    catch (err) {

        if (err.name === "TokenExpiredError") {
            return res.status(498).json({ "error": "Token Expired! please login again" });
        }
        else{
            return res.status(498).json({ "error": "Token verification failed" });
        }
    }

};

module.exports = ValidateJWT;
