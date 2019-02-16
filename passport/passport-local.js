'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    console.log(username);
    User.findOne({'username': username}, (err, user) => {
       if(err){
           return done(err);
       }
        
        if(user){
            return done(null, false, req.flash('error', 'User with username already exist'));
        }
        
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.password = newUser.encryptPassword(req.body.password);
        
        newUser.save((err) => {
            done(null, newUser);
        });
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    
    User.findOne({'username': username}, (err, user) => {
        if(err){
           return done(err);
        }
        
        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('Username Does Not Exist or Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }
        
        return done(null, user);
    });
}));