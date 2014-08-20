'use strict';

var dotenv = require('dotenv');
dotenv.load();

try {
    var fbid = process.env.OPENHANGOUTS_FACEBOOK_APP_ID,
        fbsecret = process.env.OPENHANGOUTS_FACEBOOK_APP_SECRET;
    var twitterid = process.env.OPENHANGOUTS_TWITTER_APP_ID,
        twittersecret = process.env.OPENHANGOUTS_TWITTER_APP_SECRET;
    var githubid = process.env.OPENHANGOUTS_GITHUB_APP_ID,
        githubsecret = process.env.OPENHANGOUTS_GITHUB_APP_SECRET;
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
        callbackURL: 'https://openhangouts-21450.onmodulus.net/auth/facebook/callback'
    },
    twitter: {
        clientID: twitterid,
        clientSecret: twittersecret,
        callbackURL: 'https://openhangouts-21450.onmodulus.net/auth/twitter/callback'
    },
    github: {
        clientID: githubid,
        clientSecret: githubsecret,
        callbackURL: 'https://openhangouts-21450.onmodulus.net/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'https://openhangouts-21450.onmodulus.net/'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    }
};
