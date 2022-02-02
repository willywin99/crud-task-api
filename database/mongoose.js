const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/taskmanagerdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log("DB Connected Successfully!");
  })
  .catch((error)=> {
    console.log(error);
  });

module.exports = mongoose;