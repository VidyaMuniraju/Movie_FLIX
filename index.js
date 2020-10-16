const express = require('express'),
    morgan = require('morgan');
const app = express();

let logToConsole = (req, res, next) => {
    console.log(req.url);
    next();
}

app.use(morgan("common"));
app.use(logToConsole);
app.use(express.static("public"));


let topMovies = [
  {
    title: "The Godfather I",
    director: "Francis Ford Coppola",
  },
  {
    title: "The Lord of The Rings- The Fellowship of the Ring",
    director: "Peter Jackson",
  },
  {
    title: "The Wizard of Oz",
    director: "Victor Fleming",
  },
  {
    title: "Star Wars - A New Hope",
    director: "George Lucas",
  },
  {
    title: "The Shining",
    director: "Stanley Kubrick",
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
  },
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
  }
];

app.get('/', (req, res) => {
    res.send('Welcome Movie Buffs!');
});

app.get('/movies', (req, res, next) => {
    if(topMovies){
        res.json(topMovies);
    }
    else{
        next();
    }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});