const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
let Todo = require('./todo.model');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log('MongoDB established successfuly')
})

todoRoutes.route('/').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err)
        } else {
            res.json(todos)
        }
    })
})

todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;

    Todo.findById(id, function (err, todo) {
        if (err) {
            console.log(err)
        } else {
            res.json(todo)
        }
    })
})

todoRoutes.route('/add').post(function (req, res) {
    let todo = new Todo(req.body);

    todo.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfuly' })
        })
        .catch(err => {
            res.status(400).send('adding new todo failed')
        });
})

todoRoutes.route('/delete/:id').delete(function (req, res) {
    let id = req.params.id;

    Todo.deleteOne({ id: id }, function (err) {
        console.log(id)
        if (err) return err;
    });
    Todo.findOneAndDelete({ id: id }, (err, result) => {
        if (err) return res.send(500, err);
        res.send('A darth vader quote got deleted')
    })

})

todoRoutes.route('/update/:id').post(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (!todo) {
            res.status(404).send('data is not found')
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_completed = req.body.todo_completed;
        }

        todo.save().then(todo => {
            res.json('Todo is updated')
        })
            .catch(err => {
                res.status(400).send('Update is not possible')
            })
    })
})



app.use('/todos', todoRoutes);


app.listen(PORT, function () {
    console.log('Server is running on PORT: ' + PORT)
})