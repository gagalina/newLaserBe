const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let ToDo = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_completed: {
        type: Boolean
    }
});

module.exports = mongoose.model('Todo', ToDo);