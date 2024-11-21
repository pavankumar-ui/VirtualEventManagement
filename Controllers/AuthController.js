const User = require("../Model/Usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { AuthserverError } = require("../Utils/ServerError");




const SignupUser = async (req, res, next) => {

    try {
        const body = req.body;
        body.password = await bcrypt.hash(body.password, 10);
        const userTable = await User.create(body);

        res.status(201).json({
            message: "User registered Successfully",
            user: {
                id: userTable._id,
                email: userTable.email,
                username: userTable.username,
            },
        });

    }
    catch (err) {

        AuthserverError(err, res, next);
    }
}

const SigninUser = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const userTable = await User.findOne({ email });

        if (!userTable) {
            return res.status(400).json({ error: "User not found ,for the given email" });
        }

        const dbPassword = userTable.password;
        const checkedPassword = await bcrypt.compare(password, dbPassword);
        //check whether passwords match with the hashed password//

        if (!checkedPassword) {
            return res.status(401).json({ error: "invalid Credentials" });
        }

        const token = jwt.sign(
            { email: userTable.email, id: userTable._id, role: userTable.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" });

        return res.status(200).json({ success: true, token, role: userTable.role });

    } catch (err) {
        //console.log(err);
        AuthserverError(err, res, next);
    }
}



const getProfile = async (req, res, next) => {
    try {
        const userTable = await User.findById(req.user.id);
        return res.status(200).json({
            message: "User Profile",
            user: userTable,
        });
    }
    catch (err) {
        //console.log(err);
        AuthserverError(err, res, next);
    }
}

module.exports = {
    SignupUser,
    SigninUser,
    getProfile
};