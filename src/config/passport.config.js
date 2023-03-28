const passport = require('passport');
const local = require('passport-local');
const UserManager = require("../dao/managers/user-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");
const { isValidPassword,createHash } = require('../utils');
const GithubStrategy = require("passport-github2");

const localStrategy = local.Strategy;

const GITHUB_CLIENT_ID = "Iv1.27f1c4cd901d66ef"; // USE VARIABLES DE ENTORNO
const GITHUB_CLIENT_SECRET = "6e477bbdf62b6c3cea54fa629a144880b2e9dac3"; // USE VARIABLES DE ENTORNO

const initializePassport = () => {
    const userManager = new UserManager();
    const cartManager = new CartManager();

    passport.use(
        "github",
        new GithubStrategy(
          {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/v1/session/github/callback",
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              console.log("PROFILE INFO ******", profile);
              let user = await userManager.getUser(profile._json?.email);
              if (!user) {
                const newCart = await cartManager.addCart();
                if(!newCart) {
                    console.log("Cant create a new cart");
                    return done(null, false);
                }
                const userData = { email: profile._json?.email, password: "", first_name: profile._json.name, last_name: "", age: 0, address: "", cart: newCart._id, role:"user" };

                let newUser = await userManager.addUser(userData);
                done(null, newUser);
              } else {
                // ya existia el usuario
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
                const user = await userManager.getUser(username);
                if(!user) {
                    console.log("user doesn't exist");
                    return done(null, false);
                }
                if(!isValidPassword(user, password)){
                    console.log("invalid password");
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
            const { first_name, last_name, email, age, password, address, role = 'user' } = req.body;
            try {
                let user = await userManager.getUser(username);
                if(user) {
                    console.log("User already exists");
                    return done(null, false);
                }
                const newCart = await cartManager.addCart();
                if(!newCart) {
                    console.log("Cant create a new cart");
                    return done(null, false);
                }

                console.log(newCart)
                const userData = { email, password: createHash(password), first_name, last_name, age, address, cart: newCart._id, role };
                const newUser = await userManager.addUser(userData);
                if(!newUser) {
                    console.log("Cant create a new cart");
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
        const user = await userManager.getUserById(id);
        done(null, user)
    })
}

module.exports = { initializePassport }