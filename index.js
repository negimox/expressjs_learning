const Joi = require("joi");
const express = require("express");

const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "maths" },
  { id: 2, name: "hindi" },
  { id: 3, name: "english" },
];

app.get("/", (req, response) => {
  response.send("Hello world!");
});

app.get("/api/courses", (req, response) => {
  response.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("404 not found");
  }
  res.send(course);
});

app.post("/api/courses/", (req, res) => {
  // DATA VALIDATION

  // USING JOI
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Look up the course.
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("404 not found");
  }
  //Validate the data.
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //Update course
  course.name = req.body.name;
  res.send(course);
});

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

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
