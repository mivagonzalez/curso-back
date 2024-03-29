const passport = require('passport');
const local = require('passport-local');
const { CartService, UserService } = require('../services')
const { UserDTO } = require('../dto')
const { isValidPassword,createHash } = require('../utils');
const GithubStrategy = require("passport-github2");
const { API_VERSION } = require('../config/config');
const localStrategy = local.Strategy;
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, PORT, HOST } = require("../config/config");
const { Logger, ROLES } = require('../helpers')

const initializePassport = () => {

    passport.use(
        "github",
        new GithubStrategy(
          {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: `http://${HOST}:${PORT}/api/${API_VERSION}/session/github/callback`,
            scope: ['user:email']
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              let user = await UserService.getUser(profile.emails[0].value);
              if (!user) {
                const newCart = await CartService.addCart();
                if(!newCart) {
                    Logger.error("Cant create a new cart")
                    return done(null, false);
                }
                const userDTO = new UserDTO({ email: profile.emails[0].value, password: "", first_name: profile._json.name, last_name: "", age: 0, address: "", cart: newCart._id, role:"user"})
                let newUser = await UserService.addUser(userDTO);
                done(null, newUser);
              } else {
                done(null, user);
              }
            } catch (error) {
              return done(error);
            }
          }
        )
      );

    passport.use('login', new localStrategy(
        {usernameField: 'email'}, async(username, password, done) => {
            try {
                const user = await UserService.getUser(username);
                if(!user) {
                    Logger.error("user doesn't exist")
                    return done(null, false);
                }
                if(!isValidPassword(user, password)){
                    Logger.error("invalid password");
                    return done(null, false);
                }
                const updatedUser = await UserService.updateLastLogIn(user._id);
                if (!updatedUser) {
                    Logger.error("Failed to update last login time");
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);                
            }
        }
    ))

    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, pw, done) => {
            const { first_name, last_name, email, age, password, address, role = ROLES.USER } = req.body;
            console.log(req.body)
            try {
                let user = await UserService.getUser(username);
                if(user) {
                    Logger.error("User already exists");
                    return done(null, false);
                }
                const newCart = await CartService.createCart();
                if(!newCart) {
                    Logger.error("Cant create a new cart");
                    return done(null, false);
                }
                console.log(first_name, last_name, email,age,password, address)
                if(!first_name || !last_name|| !email|| !age|| !password|| !address){
                    Logger.error("You must send all fields to register");
                    return done(null, false);
                }
                const userDTO = new UserDTO({ email, password, first_name, last_name, age, address, cart: newCart._id, role})
                const newUser = await UserService.addUser(userDTO);
                if(!newUser) {
                    Logger.error("Cant create a new cart");
                    return done(null, false);
                }
                return done(null, newUser)
            } catch (error) {
                return done("error al crear el nuevo ususario" + error);
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getUserById(id);
        done(null, user)
    })
}

module.exports = { initializePassport }