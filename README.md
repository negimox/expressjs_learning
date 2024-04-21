# ExpressJS

It is a framework that builds for Nodejs.

# Setup

npm i express

- Recommended:
  npm i nodemon

```
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

```

# REST APIs

## GET

```
app.get("/", (req, response) => {
  response.send("Hello world!");
});
```

## POST

Here JOI is used which is a js library for data validation.

```
app.use(express.json());

```

Is neccesary to add this to allows your Express application to handle JSON-encoded data.

```
app.post("/api/courses/", (req, res) => {
  // DATA VALIDATION

  // USING JOI
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  console.log(result);
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

```

## PUT

```
app.put("/api/courses/:id", (req, res) => {

  //Look up the course.
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("404 not found");
  }

  //Validate the data.
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  //Update course
  course.name = req.body.name;
  res.send(course);
});
```

## DELETE

```
app.delete("/api/courses/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("404 not found");
  }
  //Not exist return 404
  //Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //Return the same course.
  res.send(course);
});
```

# Parameters

```
app.get("/api/courses/:id/:topic", (req, res) => {
res.send(req.id);
});
```

## Query Params

```
app.get("/api/courses/:id/:topic", (req, res) => {
res.send({ ...req.params, ...req.query });
});
```

# MIDDLEWARES

Understanding middlewares with help of hospital example during the pandemic season.
To visit the doctor for a health checkup, a patient would have to undergo some tasks before.
These tasks include document verification, medical history, BP/Blood/temperature checkups etc.
Consider these tasks as requests waiting to get processed by the server(hospital staff).

Here the tasks: document verification, medical history, BP/Blood/temperature checkups would be middlewares.

```
function userMiddleware(req, res, next) {
  // Username verification for the given inputs.
  const username = req.headers.username;
  const password = req.headers.password;
  if (username != "soni" || password != "pass") {
    res.status(403).json({
      message: "User doesn't exists!",
    });
    // Early return as we dont want to execute the rest of the code
    // since the user authentication failed.
    return;
  }
  // If the validation is successful, call the next middleware function.
  next();
}

function kidneyMiddleware(req, res, next) {
  // Input validation for the given inputs.
  const kidneyId = req.query.kidneyId;
  if (kidneyId != 1 && kidneyId != 2) {
    res.status(411).json({
      message: "Wrong inputs!",
    });
    // Early return as we dont want to execute the rest of the code
    // since the user authentication failed.
    return;
  }
  // If the validation is successful, call the next middleware function.
  next();
}

// In the route, we are passing the middleware functions as arguments for the validation tasks.
// Here, first the userMiddleware function will be executed and then the kidneyMiddleware function will execute.
app.get(
  "/health-checkup-four",
  userMiddleware,
  kidneyMiddleware,
  function (req, res) {
    // Do something with kidney here
    res.send("You are healthy!");
  }
);

app.get(
  "/replace-kidney-three",
  userMiddleware,
  kidneyMiddleware,
  function (req, res) {
    // The kidney replacement logic will be written here.

    // If kidney replacement is successful.
    res.send("Your kidney has been replaced, you are healthy now!");
  }
);
```

## app.use()

In above routes, we had passed the middleware functions as arguments.
If we want to apply a middleware function to all the routes, we can use `app.use()` function.
All the middleware functions passed in the `app.use()` function will be applied for all the routes.

This middleware helps us to parse the body of the request as a json { as body of an request can be sent in different formats like html, text etc }
Generally used to parse the body of POST requests.
`app.use(express.json());`
This middleware helps us to parse the body of the request as a url encoded string.
`app.use(express.urlencoded({ extended: true }));
`
The above two middlewares will be applied to all the routes.

// Extra: Rate Limiting is also part of Middleware concept //Rate Limiting ~ like make sure a single person can only send 5 requests per day

# INPUT VALIDATION

The backend servers are hosted on the internet and are accessed by many users.
They always look for valid input to return the response to the user. But a user can give any type of input and make the server crash.
The error messages shown by the backend code are quite long and not every user can understand, and it is also not safe to display server information to the user on the frontend.
To avoid error messages, input validation is needed.

<b>One way is to use conditionals to check the input type and content.
But it is a long task because there might be multiple conditionals needed till the server receives the perfect input.
</b>

## Global Catches

Another way is to use global catches. It is a middleware that helps in error handling.
Global catches should be defined after all the routes so that any time an exception occurs in any route, the Global catches middleware will get called.
Global catches takes 4 inputs. The extra input is the error message that needs to be shown to the user.

```
app.use(function (err, req, res, next) {
  res.json({
    msg: "Something's wrong with the server!",
  });
}
```

The above global catch was a general example. In real world, multiple checks are needed to be done for the input validation.
This is where **Zod** comes into picture. It helps to check user input based on the data type.
It checks the data type of the input that the server needs and the data type of the user input.
Using zod makes easy for the developer to perform input validation. The tricky part here is to define the schema.

# HASHING

- Is one directional.
- Given the output noone can find the input.

# ENCRYPTION

- Is two way.
- A string is encrypted using a password.
- String can be decrypted using the same password.

# JSON Web Token (JWT)

- Its neither hasing or encryption its techincally a digital signature.
- Anyone can see the output given the signature.
- Signature can be verified only using the password [stored on server etc]

## AUTHENTICATION

From Frontend ==> Data {Email, Password etc} ==> Backend ==> Checks the data with the one stored in Database ==> Returns a JWT to Frontend ==> Stores in Local Storage

After this on every request user doesn't need to login for every authenticated action,
From Frontend ==> JWT {Anyone can see this and anyone who gets access to this can see the data} ==> Backend ==> Checks if the token is valid ==> Returns with the requested action

Syntax:

```
const jwt = require("jsonwebtoken")

jwt.sign(object, jwtPassword);

jwt.verify(token, jwtPassword);
```

# DATABASES

Various avaiable DB:

- Graph
- Vector
- NoSQL: MongoDB
- SQL: Most famous for full stack dev

## MongoDB

- Schemaless

**Getting Started:**

- Create an instance using mongodb website.
- Using mongodb compass connect to the given instance using the connection string.

**Connecting with the DB using server**

Mongoose allows us to connect to the DB.

Example:

```
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

const User = mongoose.model('Users', { name: String, email: String, password: String });

const user = new User({
  name: 'Vishal Singh',
  email: 'tugrp@example.com',
  password: '123456'
});

user.save();
```
