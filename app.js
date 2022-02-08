const express = require('express');
const app = express();
const mongoose = require('./database/mongoose')

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');

/*
  CORS - Cross Origin Request Security
  Backend - http://localhost:3000
  Frontend - http://localhost:4200
*/
// 3rd party library, app.use(cors());
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Pass to next layer of middleware
  next();
});

// Example of middleware
app.use(express.json());  // Or 3rd party bodyParser

// Routes of REST API Endpoints or RESTful webservices Endpoints
/*
  TaskList - Create, Update, ReadTaskListById, ReadAllTaskList
  Task - Create, Update, ReadTaskById, ReadAllTask
*/

// Routes or API endpoints for TaskList model
// Get all Task Lists
// http://localhost:3000/tasklists => [ {TaskList}, {TaskList} ]
app.get('/tasklists', (req, res) => {
  TaskList.find({})
    .then((lists) => { 
      res.status(200);
      res.send(lists);
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
    });
});

// Route or Endpoint for Creating a TaskList
app.post('/tasklists', (req, res) => {
  // console.log("Hello i am inside post method");
  console.log(req.body);

  let taskListObj = { 'title': req.body.title };
  TaskList(taskListObj).save()
    .then((taskList) => { 
      res.status(201);
      res.send(taskList);
    })
    .catch((error) => { 
      console.log(error);
      res.status(500);
    });
});

// Endpoint to get one tasklist by taskListId: http://localhost:3000/tasklists/61fae4597db5e686809a1db4
app.get('/tasklists/:taskListId', (req, res) => {
  let taskListId = req.params.taskListId;
  TaskList.find({ _id: taskListId })
    .then((taskList) => {
      res.status(200).send(taskList)
    })
    .catch((error) => {
      console.log(error);
    });
});

// PUT is full update of object
app.put('/tasklists/:taskListId', (req, res) => {
  TaskList.findOneAndUpdate({ _id: req.params.taskListId }, { $set: req.body })
    .then((taskList) => {
      res.status(200).send(taskList)
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
    });
});
// PATCH is partial update of one field of an object
app.patch('/tasklists/:taskListId', (req, res) => {
  TaskList.findOneAndUpdate({ _id: req.params.taskListId }, { $set: req.body })
    .then((taskList) => {
      res.status(200).send(taskList)
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
    });
});

// DELETE a tasklist by id
app.delete('/tasklists/:taskListId', (req, res) => {

  // Delete all tasks within a if that tasklist is deleted
  const deleteAllContainingTask = (taskList) => {
    Task.deleteMany({ _taskListId: req.params.taskListId })
      .then(() => { return taskList })
      .catch((error) => { console.log(error) });
  };

  const responseTaskList = TaskList.findByIdAndDelete(req.params.taskListId)
    .then((taskList) => {
      deleteAllContainingTask(taskList);
    })
    .catch(
      (error) => { console.log(error) }
    )
  res.status(200).send(responseTaskList);
});

/*
  CRUD operation for Task, a task should always belongs to a TaskList
*/
// Get all tasks for 1 TaskList, http://localhost:3000/taskslists/:taskListId/tasks
app.get('/tasklists/:taskListId/tasks', (req, res) => {
  Task.find({ _taskListId: req.params.taskListId })
    .then((tasks) => {
      res.status(200).send(tasks)
    })
    .catch((error) => {
      console.log(error)
    });
});
// Create a task inside a particular Task List
app.post('/tasklists/:taskListId/tasks', (req, res) => {
  console.log(req.body);

  let taskObj = { 'title': req.body.title, '_taskListId': req.params.taskListId };
  Task(taskObj).save()
    .then((task) => {
      res.status(201).send(task);
    })
    .catch((error) => {
      console.log(error);
    });
});

// http://localhost:3000/taskslists/:taskListId/tasks/:taskId
// Get 1 task inside 1 TaskList
app.get('/tasklists/:taskListId/tasks/:taskId', (req, res) => {
  Task.find({ _taskListId: req.params.taskListId, _id: req.params.taskId })
    .then((task) => {
      res.status(200).send(task)
    })
    .catch((error) => {
      console.log(error)
    });
});

// Update 1 Task belonging to 1 TaskList
app.patch('/tasklists/:taskListId/tasks/:taskId', (req, res) => {
  Task.findOneAndUpdate({ _taskListId: req.params.taskListId, _id: req.params.taskId }, { $set: req.body })
    .then((task) => {
      res.status(200).send(task)
    })
    .catch((error) => { console.log(error) });
});

// Delete 1 Task belonging to 1 TaskList
app.delete('/tasklists/:taskListId/tasks/:taskId', (req, res) => {
  Task.findOneAndDelete({ _taskListId: req.params.taskListId, _id: req.params.taskId })
    .then((task) => {
      res.status(200).send(task)
    })
    .catch((error) => { console.log(error) });
});

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});