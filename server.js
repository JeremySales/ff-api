const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 8000
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'ff'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/',(req,res)=>{
    db.collection('movies').find().toArray()
    .then (data => {
        res.send(data)
    })
    .catch(err => console.error(err))
});

app.post('/', (req, res) =>{
    db.collection('movies').insertOne({name: req.body.name,
    watched: false,
    watchCnt: 0})
    .then(result => {
        console.log('Movie added')
        res.redirect('/')
    })
    .catch(err => console.error(err))
});

app.put('/', (req, res) => {
    db.collection('movies').updateOne({name: req.body.name, 
        watched: req.body.watched,
        watchCnt: req.body.watchCnt},{
        $set: {
            watched: true,
            watchCnt: req.body.watchCnt + 1
          }
    },{
        upsert: true
    })
    .then(result => {
        console.log('Watched movie')
        res.json('Movie Watched')
    })
    .catch(err => console.error(err))

});

app.delete('/', (req, res) => {
    db.collection('movies').deleteOne({name: req.body.name, 
        watched: false})
    .then(result => {
        console.log('Unwatched Movie Deleted')
        res.json('Movie Deleted')
    })
    .catch(err => console.error(err))
});

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`server running on port ${PORT}`)
});