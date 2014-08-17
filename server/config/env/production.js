'use strict';

var dotenv = require('dotenv');
dotenv.load();

try {
    var fbid = process.env.OPENHANGOUTS_FACEBOOK_APP_ID,
        fbsecret = process.env.OPENHANGOUTS_FACEBOOK_APP_SECRET;
}
catch (err){
    console.log('Facebook app identifiers missing in env - please export the right parameters');
    throw new Error();
}

module.exports = {
    db: 'mongodb://'+ process.env.MONGODB_USER +':'+ process.env.MONGODB_PASS+'@proximus.modulusmongo.net:27017/o7xOvape',
    app: {
        name: 'MEAN - A Modern Stack - Production'
    },
    facebook: {
        clientID: fbid,
        clientSecret: fbsecret,
        callbackURL: 'https://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    }
};
