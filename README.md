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

# REST API's

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
