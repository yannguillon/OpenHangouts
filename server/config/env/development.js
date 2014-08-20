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
    db: 'mongodb://localhost/mean-dev',
    app: {
        name: 'MEAN - FullStack JS - Development'
    },
    facebook: {
        clientID: fbid,
        clientSecret: fbsecret,
        callbackURL: 'https://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: twitterid,
        clientSecret: twittersecret,
        callbackURL: 'https://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: githubid,
        clientSecret: githubsecret,
        callbackURL: 'https://localhost:3000/auth/github/callback'
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
