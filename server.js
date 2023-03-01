'use strict';

const express = require('express');

const cors = require('cors');

const server = express();

const trendingData = require ('./Movie Data/data2.json');

const axios = require('axios');

server.use(cors());

const PORT = 3450;

//construtors
function movieLibarry(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Trending(id,title,release_date,poster_path,overview){
    this.id = id ; 
    this.title = title ;
    this.release_date = release_date ;
    this.poster_path = poster_path ;
    this.overview = overview ; 
}

//Routes
server.get('/', homeHandler);
server.get('/favorite', favoritHeandler);
//server.get('/trending', trendingHeandler);
server.get('/trending', newtrendingHeandler);
server.get('*', errorHandler);

// Function Handlers
function homeHandler(req, res) {
    const movieData = require('./Movie Data/data.json');
    const movies = new movieLibarry(movieData.title, movieData.poster_path, movieData.overview);
    res.send(movies);
}

function favoritHeandler(req, res) {
    res.send('Welcome to Favorite Page');
}

function errorHandler(req, res) {
    let obj = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    }
    res.send(obj);
}

// function trendingHeandler(req,res){
//     let trendingRes = trendingData.results.map((item)=>{
//         let singleTrend = new Trending(item.id,item.title,item.release_date,item.poster_path,item.overview);
//         return singleTrend;
//     })
//     res.send(trendingRes);
// }

async function newtrendingHeandler(req,res){
    const apikey = "a7d3c5f3a15ecdc56b7c66dabb852fbb";
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apikey}`;
    let axiosRes = await axios.get(url);
    res.send(axiosRes.data);
}

// http://localhost:3450;
server.listen(PORT, () => {
    console.log(`listening on ${PORT} : Iam ready`);
});
