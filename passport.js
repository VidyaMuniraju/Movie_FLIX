/**
* Importing the required modules
*/
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
* Defining the authentication strategy for the login functionality.
* It takes a username and password as parameters, checks for the username in the DB
* If username matches, it ensures the passwords match.
*/
passport.use(new LocalStrategy ({
   usernameField: 'Username',
   passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        if(error){
            console.log(error);
            return callback(error);
        }
        if(!user){
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        if(!user.validatePassword(password)){
            console.log('Incorrect Password');
            return callback(null, false, {message: 'Incorrect password.'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));

/**
* This strategy authenticates users by the JWT token provided.
*/
passport.use(new JWTStrategy ({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) =>{
       return Users.findById(jwtPayload._id)
       .then((user) =>{
           return callback(null, user);
       })
       .catch((error) => {
           return callback(error)
       });  
}));
