const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const mongoose = require('mongoose'),
      Models = require('./models.js');
      
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(morgan('common'));
app.use(express.static("public"));
app.use(bodyParser.json());

// the root URL
app.get('/', (req, res) => {
    res.send('Welcome Movie Buffs!');
});

// get the list of all movies
app.get('/movies', (req, res, next) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// get data about a single movie
app.get('/movies/:Title', (req, res, next) => {
  Movies.findOne({ Title: req.params.Title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get data about a genre
app.get('/movies/Genre/:Name', (req, res, next) => {
  Movies.findOne({'Genre.Name': req.params.Name})
  .then((movie) => {
    res.json(movie.Genre);
  })
  .catch((err) => {
    console.erroe(err);
    res.status(500).send('Error: ' + err);
  });
});

// get data about a director
app.get('/movies/Director/:Name', (req, res, next) => {
  Movies.findOne({ 'Director.Name': req.params.Name})
  .then((movie) => {
    res.json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// allow new users to register
app.post('/users', (req, res, next) => {
  Users.findOne({ Username: req.body.Username})
  .then((user) => {
    if(user){
      return res.status(400).send(req.body.Username + 'already exists');
    }
    else{
      Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          EmailId: req.body.EmailId,
          BirthDay: req.body.BirthDay
        })
        .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error:' + error);
        })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// get data about a user
app.get('/users/:Username', (req, res, next) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// get data about all users
app.get('/users', (req, res, next) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// allow users to update their user info (username)
app.put('/users/:Username', (req, res, next) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      EmailId: req.body.EmailId,
      BirthDay: req.body.BirthDay
    }
  },
  { new: true},
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
    else{
      res.json(updatedUser);
    }
  });
});

// allow users to add a movie to their list of favorites
app.post('/users/:Username/favoritemovies/:MovieID', (req, res, next) => {
  Users.findOneAndUpdate( { Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
    else{
      res.json(updatedUser);
    }
  });
});

// allow users to remove a movie from their list of favorites
app.delete('/users/:Username/favoritemovies/:MovieID', (req, res, next) => {
  Users.findOneAndUpdate( { Username: req.params.Username}, {
    $pull: { FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
    else{
      res.json(updatedUser);
    }
  });
});

// allow existing users to deregister
app.delete('/users/:Username', (req, res, next) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } 
      else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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