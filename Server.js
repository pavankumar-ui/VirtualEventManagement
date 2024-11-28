require('dotenv').config();


const PORT = process.env.PORT || 3001;
const app = require("./App");


app.listen(PORT, (err) => {
    if (err) {
        console.log("something bad has happend");
    }
    console.log(`server is running on port ${PORT}`);
});