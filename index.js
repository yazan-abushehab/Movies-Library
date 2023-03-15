'use strict';

const express = require('express');
const cors = require('cors');
const server = express();
//const trendingData = require ('./Movie Data/data2.json');
const axios = require('axios');
require('dotenv').config();
const pg = require('pg');


server.use(cors());
server.use(express.json());
//server.use(errorHandler);


const PORT = process.env.PORT || 3450;

const client = new pg.Client(process.env.DATABASE_URL);


//construtors
function movieLibarry(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Trending(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

//Routes
server.get('/', homeHandler);
server.get('/favorite', favoritHeandler);
//server.get('/trending', trendingHeandler);
server.get('/trending', newtrendingHeandler);
server.get('/search', searchHeandler);
server.get('/topmovies', movieTopRratedHeandler);
server.get('/discover', discoverMovieHeandler);
server.get('/getmovies', getAllmoviesHandler)
server.post('/getmovies', addmoviesHandler)
server.delete('/getmovies/:id', deletemoviesHandler)
server.put('/getmovies/:id', updatamoviesHandler)
server.get('/getmovies/:id', getmoviesHandler)
server.get('*', defultHandler);

// Function Handlers
function homeHandler(req, res) {
    const movieData = require('./Movie Data/data.json');
    const movies = new movieLibarry(movieData.title, movieData.poster_path, movieData.overview);
    res.send(movies);
}

function favoritHeandler(req, res) {
    res.send('Welcome to Favorite Page');
}


function defultHandler(req, res) {
    let obj = {
        "status": 404,
        "responseText": "Sorry, page not found"
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

function newtrendingHeandler(req, res) {
    try {
        console.log("your data was send !");
        const apikey = process.env.apikey;
        const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apikey}`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((item) => {
                    let singleTrend = new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleTrend;
                })
                res.send(mapResult);
            })
            .catch((error1) => {
                console.log("sorry,something went wrong");
                res.status(500).send(error1);
            })
    }
    catch (error) {
        errorHandler(error, req, res, next);
    }
}

function searchHeandler(req, res) {
    try {
        const apikey = process.env.apikey;
        const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query="lord%20of%20the%20rings"`;
        axios.get(url2)
            .then((result2) => {
                let mapResult2 = result2.data.results.map((item) => {
                    let singleTrend2 = new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleTrend2;
                })
                res.send(mapResult2);
            })
            .catch((error1) => {
                console.log("sorry,something went wrong");
                res.status(500).send(error1);
            })
    }
    catch (error) {
        errorHandler(error, req, res, next);
    }
}

function movieTopRratedHeandler(req, res) {
    try {
        const apikey = process.env.apikey;
        const url3 = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}`;
        axios.get(url3)
            .then((result3) => {
                let mapResult3 = result3.data.results.map((item) => {
                    let singleTrend3 = new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleTrend3;
                })
                res.send(mapResult3);
            })
            .catch((error1) => {
                console.log("sorry,something went wrong");
                res.status(500).send(error1);
            })
    }
    catch (error) {
        errorHandler(error, req, res, next);
    }
}

function discoverMovieHeandler(req, res) {
    try {
        const apikey = process.env.apikey;
        const url4 = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}`;
        axios.get(url4)
            .then((result4) => {
                let mapResult4 = result4.data.results.map((item) => {
                    let singleTrend4 = new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleTrend4;
                })
                res.send(mapResult4);
            })
            .catch((error1) => {
                console.log("sorry,something went wrong");
                res.status(500).send(error1);
            })
    }
    catch (error) {
        errorHandler(error, req, res, next);
    }
}

function getAllmoviesHandler(req, res) {
    const sql = `SELECT * FROM getmovies`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((error1) => {
            //console.log("sorry,something went wrong");
            res.status(500).send("sorry,something went wrong");
        })
}

function addmoviesHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO getMovies (title, release_date, poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview]
    client.query(sql, values)
        .then((data) => {
            res.send("your data was added !")
        })
        .catch((error1) => {
            //console.log("sorry,something went wrong");
            res.status(500).send("sorry,something went wrong");
        })
}

function deletemoviesHandler(req, res) {
    //console.log(req.params);
    const id = req.params.id;
    const sql = `DELETE FROM getmovies WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.status(204).json({});
        })
        .catch((error1) => {
            //console.log("sorry,something went wrong");
            res.status(500).send("sorry,something went wrong");
        })
}

function updatamoviesHandler(req, res) {
    const id = req.params.id;
    //console.log(id);
    console.log(req.body);
    const sql = `UPDATE getmovies SET title=$1, release_date=$2, poster_path=$3, overview=$4 WHERE id=${id} RETURNING *`;
    const values = [req.body.title,req.body.release_date,req.body.poster_path,req.body.overview];
    client.query(sql,values)
    .then((data)=>{
       // console.log(data)
        res.status(200).send(data.rows);
    })
    .catch((error1) => {
        //console.log("sorry,something went wrong");
        res.status(500).send("sorry,something went wrong");
    })
}

function getmoviesHandler(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM getmovies WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((error1) => {
            //console.log("sorry,something went wrong");
            res.status(500).send("sorry,something went wrong");
        })
}


// function errorHandler (error,req,res){
//     const err = {
//         status: 500,
//         massage: error
//     };
//     res.send(err)
// }


// http://localhost:3450;
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : Iam ready`);
        });
    });

