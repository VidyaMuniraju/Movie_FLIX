const express = require('express'),
    morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use(express.static("public"));


let topMovies = [
  {
    title: "The Godfather I",
    director: "Francis Ford Coppola",
    genre: "Mafia"
  },
  {
    title: "The Lord of The Rings- The Fellowship of the Ring",
    director: "Peter Jackson",
    genre: "Epic Fantasy Adventure"
  },
  {
    title: "The Wizard of Oz",
    director: "Victor Fleming",
    genre: "Musical Fantasy"
  },
  {
    title: "Star Wars - A New Hope",
    director: "George Lucas",
    genre: "Science Fiction"
  },
  {
    title: "The Shining",
    director: "Stanley Kubrick",
    genre: "Psychological Horror"
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    genre: "Romantic Comedy-Drama"
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    genre: "Crime Comedy"
  },
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    genre: "Drama"
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    genre: "Superhero Action Thriller"
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    genre: "Science Fiction"
  }
];

// the root URL
app.get('/', (req, res) => {
    res.send('Welcome Movie Buffs!');
});

// get the list of all movies
app.get('/movies', (req, res, next) => {
    if(topMovies){
        res.json(topMovies);
    }
    else{
        next();
    }
});

// get data about a single movie
app.get('/movies/:title', (req, res, next) => {
  // res.json(topMovies.find((title) => {
  //   return topMovies.title === req.params.title
  // }));
  res
    .status(201)
    .send('Here is the data about the movie:' + req.params.title);
});

// get data about a genre
app.get('/movies/genres/:genreName', (req, res, next) => {
  // res.json(topMovies.find((genre) => {
  //   return topMovies.genre === req.params.genreName
  // }));
  res
    .status(201)
    .send("Here is the data about the genre:" + req.params.genreName);
});

// get data about a director
app.get('/movies/directors/:directorName', (req, res, next) => {
  // res.json(topMovies.find((director) => {
  //   return topMovies.director === req.params.directorName
  // }));
  res
    .status(201)
    .send("Here is the data about the director:" + req.params.directorName);
});

// allow new users to register
app.post('/users', (req, res, next) => {
  res.status(201).send('User has been registered');
});

// allow users to update their user info (username)
app.put('/users/:userName', (req, res, next) => {
  res.status(201).send('Your username has been successfully changed to -' + req.params.userName);
});

// allow users to add a movie to their list of favorites
app.post('/users/:userName/movies/:title', (req, res, next) => {
  res.status(201).send(req.params.title + ' was added to the list of favorites');
});

// allow users to remove a movie from their list of favorites
app.delete('/users/:userName/movies/:title', (req, res, next) => {
  res
    .status(201)
    .send(req.params.title + ' was removed from the list of favorites');
});

// allow existing users to deregister
app.delete('/users/:userName', (req, res, next) => {
  res.status(201).send('Your account has been successfully deleted');
});

// error handling function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});