require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;


const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGO_URL, {})
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((err) => {
        console.log("connection error:", err);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




const authRoutes = require("./Routes/AuthRoutes");
const eventRoutes = require("./Routes/EventRoutes");



app.use("/api/users",authRoutes);
app.use("/api/events",eventRoutes);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err); // Delegate to default error handler
    }
    return res.status(err.status || 500).json({ error: err.message });
});



app.listen(PORT, (err) => {
    if (err) {
        console.log("something bad has happend");
    }
    console.log(`server is running on port ${PORT}`);
})

module.exports = app;