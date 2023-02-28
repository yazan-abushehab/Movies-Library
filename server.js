'use strict';

const express = require('express');

const cors = require('cors');

const server = express();

server.use(cors());

const PORT = 3450;

function movieLibarry(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


server.get('/' ,(req,res)=>{
    const movieData = require('./Movie Data/data.json');
    const movies = new movieLibarry(movieData.title,movieData.poster_path,movieData.overview);
    res.send (movies);
});

server.get('/favorite' ,(req,res)=>{
    res.send('Welcome to Favorite Page');
})

server.get('*' ,(req,res)=>{
    let obj ={
        "status": 500,
        "responseText": "Sorry, something went wrong"
        }
    res.send(obj);
})


// http://localhost:3450;
server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : Iam ready`);
});
