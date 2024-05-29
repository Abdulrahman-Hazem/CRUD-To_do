const express = require("express"); //Handle api
const mongoose = require("mongoose"); //Handle database
const cors = require("cors");

const app = express(); //Create an express app

app.use(express.json()); //Allows the use of json files
app.use(cors());

const mongo_URL = "mongodb://localhost:27017";
  
mongoose
  .connect(mongo_URL) //Connect to the database
  .then(() => console.log("Connected to DB")) //If connected -> log "Connected to DB"
  .catch(console.error); //If did not connect -> log 'error message'

const Todo = require("./models/Todo"); //Import

app.get("/todos", async (req, res) => {
  //async is used to deal with multiple "get requests" intandem
  const todos = await Todo.find();

  res.json(todos); //store the "todos" here
});
    
app.post('/todo/new', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })

  todo.save(); //saves the todo to our database

  res.json(todo); //save response in json file
});

app.delete('/todo/delete/:id', async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id)

  res.json(result);
});

app.get('/todo/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

app.put('/todo/update/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  todo.text = req.body.text;

  todo.save();

  res.json(todo);
});

app.listen(3001, () => console.log("Server start on port 3001")); //creating port number "3001" -> log "Server start on port 3001"
