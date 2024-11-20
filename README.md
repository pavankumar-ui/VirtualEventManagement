# Virtual Event Management API

A simple RESTful API for managing events built with Node.js, express.js and mongoDB Cloud.

## Table Of Contents

1. Features
2. Getting Started
   a. technlogies/tools used

3. Prerequisites to be installed on your machine.

4. Setup Instructions and installation of packages.

5. API Endpoints

6. Testing the API using Postman




## Features

- Create the new event having event_title,event_description,date and time field having it's participants(attendees) and an Orgainizer who is managing the event.
- Update the event by OrganizerId
- Delete the event by OrganizerId
- To Get the Events created by Current Orgainizer(who is loggedin).
- get all the tasks for attendees role to view and register the event.
- In-memory Data Storage like Users,Events implemented through Mongo model schemas.
- Vaildations with appropriate status codes for error and data messages.
- Helper functions as files  Server Error containing AuthServerError and 
   CommonServerError class for handling errors.
 - Having Middleware for Authentication,Authorization,JWT token handling and Role Handling.
  - Having Auth and Event Controllers for handling the API requests and responses.
  - Having Routes for calling  the Controllers and middlewares.
  - Implemented Nodemailer Pacakage and mailtrap for SMTP connection to send email notification 
     who registered the event.


     ## Project Structure.

The project follows a typical Express.js application structure:

├── Middlewares/ │ └── CheckRole.js | └── TokenExpire.js | └── ValidateJWT.js | └── Validate.js 
├── Routes/ │ └── AuthRoutes.js │ └── EventRoutes.js │ └── index.js ├── Controllers/ │ └── AuthController.js │ └── EventController.js │├── Mail/ │ └── RegisterNotify.js├── Models/ │ └── Eventmodel.js │ └── Usermodel.js ├── .env ├── app.js |
|── Utils/  │ └── CommonServerError.js │ └── AuthServerError.js │ └── index.js ├── package.json ├── package-lock.json └── README.md


- AuthController.js - This file is responsible for handling registering,login and profile view of the user.
- EventController.js - This file is responsible for handling the CRUD of the events along with registering the events and getting the events.

## Getting Started

##Technologies/Tools Used

1. **Node.js** for runtime environment.
2. **Express.js** for building the API.
3. **Nodemon** To restart the server automatically when there is any change in the code.
4. **MongoDB** libraries for database.
5. **Mongoose** for MongoDB object modeling.
6. **Nodemailer** for sending emails.
7. **dotenv** for environment variables.
8. **bcryptjs** for password hashing.
9. **jsonwebtoken** for authentication.
10. **joi**  for input validation.
11. **Postman** for testing the API.

---

### Prerequisites to be installed on your machine.

- Make sure your Node.js version to be installed more than 18, not below versions.
- npm Command Line Interface (CLI) which comes under node to install the required packages.

## Setup Instructions and installation of packages.

_Step1_: Create the repository in the github and link to your machine with your specific drive.

- Git init https://github.com/pavankumar-ui/VirtualEventManagement.git

the above command will create the repository in the github and link to your machine with your specific drive.

_Step 2_ : Navigate to the Project Directory.

- Type `cd Virtual_EventManagement` in the terminal.

_Step 3_ : install the dependencies.

- `npm install` in the terminal.

_Step 4_ : install nodemon.

- `npm install nodemon --save-dev` in the terminal.

_Step 5_ : Now in the package.json file, add the following script:

- `"dev": "nodemon app.js"` in the scripts object present in package.json file.

_Step 6_ : Run the app.js file.

- `npm start` in the terminal.

_Step 7_ : Install the express package.

- `npm install express --save` in the terminal.

_Step 8_ : Now check whether the server is running in the port 3000 or not in the terminal.

_Step 9_ : If you want to place the PORT in the env file then you can install the dotenv package.

- `npm install dotenv --save-dev`
  (this will install the dotenv package in the project at the dev dependencies object in the package.json file).

- Now include the dependencies in the app.js file.
  `require("dotenv").config();`

"tap test/\*.js --disable-coverage",

- Then create the environment variable as PORT in the .env file.

- to retrive the port,give the following code in the app.js file.

  `const port = process.env.PORT || 3000;`

  app.listen(PORT, (err) => {
  if (err) {
  return console.log("Something bad happened", err);
  }
  console.log('Server is listening on ${PORT}`);
  });

- now restart the server.

_Step 10_ : The API will be available at `http://localhost:3000`.

- you can test the API using the postman.

## Routes Defined.

The following routes are available in the `Routes/AuthRoutes.js/EventRoutes.js` file:

| Method     | Path                     | Description                      | Authentication   |
| ---------- | ------------------------ | -------------------------------- | ---------------- |
| POST       | `/api/users/register`    | To Register the user (signup)    | Not Required     |
| POST       | `/api/users/login`       | To login the user (signin)       | Required         |
| GET        | `/api/users/profile`     | To Get user profile              | Required         |
| GET        | `/api/events/Getevents`  | To Get the events list (Organizer)| Required        |
| POST       |`/api/events/createEvents`| To create the events             | Required         |
| PUT        |`/api/events/updateEvent/:eventId`| To update the event      | Required         |
| DELETE     |`/api/events/deleteEvent/:eventId`| To delete the event      | Required         |
| POST       |`/api/events/:eventId/register`| To create the events(attendee)| Required       |
| GET        |`/api/events/getAllEvents`| To get all the events            | Required         |
| ---------- | ------------------------ | -------------------------------- | ---------------- |


## Middlewares Used:

`Validate.js` - this was used to validate for `register`,`login` and `events` with certain validation headers.

`ValidateJWT` - This is the main functionality to look after the authentication as well as authorization of valid tokens passed with respect to news API application.

`TokenExpire.js` - This was used to handle the token expiration error handling.

`CheckRole.js` - This was used to check the role of the user.


## Setup & Installation

- 1. Initialize The Repository

  `git init https://github.com/pavankumar-ui/VirtualEventManagement.git`
  `cd  Virtual_EventManagement`

- 2.Install Dependencies and certain packages in step by step process as required.
  `npm install`
  `npm install express`
  `npm install nodemon --save-dev`
  `npm install dotenv`
  `npm install mongoose`
  `npm install jsonwebtoken`
  `npm install bcryptjs`
  `npm install joi`
  `npm install nodemailer --save`
 

- 3.setup the `.env` file with the following variables:

`PORT=3000`
`MONGODB_URL=your_mongodb_connection_string`
`JWT_SECRET=your_jwt_secret`

- 4.Start The Server

`npm start`


## API Usage and Endpoints

To make usage of the API, please pass the headers information like `Content-type` and `Authorization` very effectively.

`Content-type: application/json`
`Authorization: Bearer <token>`

you can use the following endpoints:

- `POST /api/users/register` - Register a new user. - No need of Authorization Header for this endpoint.
- `POST /api/users/login` - Login and get a JWT token.
- `GET /api/users/profile` - Get the user profile information for the authenticated user.
- `GET /api/events/Getevents` - Get user events for the authenticated user with the role of organizer.
- `POST /api/events/createEvents` - Create a new event for the authenticated user with the role of organizer.
- `PUT /api/events/updateEvent/:eventId` - Update an existing event for the authenticated user with the role of organizer.
- `DELETE /api/events/deleteEvent/:eventId` - Delete an existing event for the authenticated user with the role of organizer.
- `POST /api/events/:eventId/register` - Register for an event for the authenticated user with the role of attendee.
- `POST /api/events/getAllEvents` - Get all events for the authenticated user with the role of attendee.

- Include the prefix like below for getting response:

- eg: `http://localhost:3000/api/users/register`.


## Dependencies Used:

- `express` - A fast and minimalist web framework for Node.js.
- `nodemon` - A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- `dotenv` - A zero-dependency module that loads environment variables from a .env file into process.env.
- `mongoose` - A MongoDB object modeling tool designed to work in an asynchronous environment.
- `jsonwebtoken` - A library for working with JSON Web Tokens (JWT) in Node.js.
- `bcryptjs` - To Generate the JSON Web Token Randomly , once the user is registered.
- `joi` - A library for validating and sanitizing user input.
- `nodemailer` - A library for sending emails.
  
