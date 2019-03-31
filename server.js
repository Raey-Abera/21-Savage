const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;//global varaibles that we can use anywhere that is holding the database

const url = "mongodb+srv://demo:demo@cluster0-ydmql.mongodb.net/test?retryWrites=true";
const dbName = "demo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')//using epress to hold view engine- the engine is ejs which is similar to html which we can plug stuff into (what we see visually)
app.use(bodyParser.urlencoded({extended: true}))//setting up the body parses so we can do what we want it to do
app.use(bodyParser.json())
app.use(express.static('public'))//enables us to not have to be specific about how we serve our static files

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {// when i refresh the page that triggered the get, get in the database, finds the messages collection and finds every doc(objects) as an array and renders it.
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})//passing result(holding array of docs) into the idex.ejs which is holding all of my documents
  })
})

app.post('/messages', (req, res) => {//http method behind posting
  // name and msg properties are pulled from the form in the ejs
  //thumbUP and thumbDown properties are hard coded
  db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err) //find db, find msg colletion, inside the collection - save the doc properties
    console.log('saved to database')
    res.redirect('/')//once done, refresh the page. refresh is triggering a get request on this route...look at get again
  })
})

app.put('/messages', (req, res) => {//put is triggered by updating
  db.collection('messages')

  //loooking for the object with a matching name or message to update
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //set is what i want to change---- thumbUP and increasing it by one
    $set: {
      thumbUp:req.body.thumbUp + 1//thumbUP triggered the fetch
    }
  }, {
    sort: {_id: -1},//this is top to bottom order
    upsert: true//if it sorts through the entire collection and it doesn't find a doc that matches, it creates it and returns the first one that it finds
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/messages/downvote', (req, res) => {//put is triggered by updating
  db.collection('messages')

  //loooking for the object with a matching name or message to update
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //set is what i want to change---- thumbUP and increasing it by one
    $set: {
      thumbDown:req.body.thumbDown + 1//thumbUP triggered the fetch
    }
  }, {
    sort: {_id: -1},//this is top to bottom order
    upsert: true//if it sorts through the entire collection and it doesn't find a doc that matches, it creates it and returns the first one that it finds
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
