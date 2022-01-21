const express = require('express');
const bodyParser = require('body-parser');
const { toUnicode } = require('punycode');
const port = process.env.PORT || 3000;
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
const day = date.getDate();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin:mongodb@sofenn.alatt.mongodb.net/todoDB?retryWrites=true&w=majority');
}

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item ({
    name: "Welcome to your todolist!"
})

const item2 = new Item ({
    name: "Hit the + button to add a new item."
})

const item3 = new Item ({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model('List', listSchema);

app.get('/', (req,res) => {

    Item.find(function(err, items) {
        if (items.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Default items added!");
                }
            })
            res.redirect('/');
        } else {
            res.render('list', {LIST: 'Today', NEWTODOS: items})
        }
    })
})

app.get('/:listName', (req,res) => {
    const customListName = req.params.listName;

    const formattedListName =  _.capitalize(customListName);

    List.findOne({name: formattedListName}, function(err, foundList) {
        if (foundList) {
            res.render('list', {LIST: foundList.name, NEWTODOS: foundList.items});
            
        } else {
            const list = new List({
                name: formattedListName,
                items: defaultItems
            })
            list.save();
            res.redirect('/' + formattedListName);
        } 
    })
})

app.post('/', (req, res) => {
    const listName = req.body.addBtn;
    const formattedListName = _.capitalize(listName);

    const newTodo = req.body.newTodo;
    const newItem = new Item ({
        name: newTodo
    });

    if(listName === 'Today') {
        newItem.save();
        res.redirect('/');
    } else {
        List.findOne({name: formattedListName}, (err, foundList) => {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect('/' + formattedListName);
        })
    }
})

app.post('/delete', (req,res) => {
    const itemID = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === 'Today') {
        Item.findByIdAndRemove(itemID, function(err) {
            if(!err) {
                console.log("deleting");
                res.redirect('/');
            }
        })
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, (err, foundList) => {
          if(!err){
              res.redirect('/' + listName);
          }
      })
    }
})




app.listen(port, () => {
    console.log('Port ' + port + " is listening");
})

