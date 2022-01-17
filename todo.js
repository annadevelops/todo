const express = require('express');
const bodyParser = require('body-parser');
const { toUnicode } = require('punycode');
const date = require(__dirname + '/date.js');
const port = 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
const newTodos = ["Develop more projects", "Push to github", "Update portfolio website" ];
const workTodos = [];
const day = date.getDate();


app.get('/', (req,res) => {
    /* Express package 'renders' the index.ejs file and pass the day values to the DAY ejs tag in the index.ejs file */
    res.render('list', {LIST:day, NEWTODOS:newTodos})
})

app.post('/', (req, res) => {
    if(req.body.addBtn === 'Work'){
        workTodos.push(req.body.newTodo);
        res.redirect('/work');
    } else {
        newTodos.push(req.body.newTodo);
        res.redirect('/');
    }
})

app.get('/work', (req,res) => {
    res.render('list', {LIST:"Work", NEWTODOS: workTodos } )
})

app.listen(port, () => {
    console.log('Port ' + port + " is listening");
})