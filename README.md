# DemoTwitterApp

Demo application that lets user login to their Twitter Account with React on frontend and Node.js/Express on backend that is implementing REST API. MongoDB is used to save the user information, token, etc values. After Logging In, it shows latest tweets about Donald Trump Or Hillary Clinton as selected by the user. User can toggle between the two to get the latest tweets.

# About

We have used the following Demo Project as a base to build the App : https://github.com/GenFirst/react-node-twitter-login
To create the authentication parameters, the reference we follow is : https://github.com/Praseetha-KR/twick/blob/master/app/apis.js
Both the referenced Projects are licensed under MIT license and hence can be used freely.
For creating React app we have used [create-react-app](https://github.com/facebookincubator/create-react-app).
For twitter API documentation, we follow : https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets

# What you need to install

* [Node.js](https://nodejs.org/en/)
* [create-react-app](https://github.com/facebookincubator/create-react-app)
* [Gulp](http://gulpjs.com/)
* [MongoDB](https://www.mongodb.com/)

# How To Start Application?

* Get your own secrets and keys from https://apps.twitter.com/
* Put `http://localhost:3000/twitter-callback` as the callback URL
* Start MongoDB - our application expects that there is `twitter-demo` database in MongoDB
* Put Twitter consumer secret, consumer key, access token secret and access token key in [twitter.config.js] (RootFolder/backend/twitter.config.js) and (RootFOlder/frontend/src/twitter.config.js)
* Go to [frontend](RootFolder/frontend) folder
    * `npm install`
    * `npm start`
* Go to [backend](RootFolder/backend) folder
    * `npm install`
    * `gulp develop
    
# Current Status

*`Currently the application can redirect a user to login to his/her Twitter account.
* Application correctly accuries token from app.twitter.com and authenticates the Twitter user.
* An error occurs when trying fetch tweets using tweet search api. 
Response from Twitter API:
Error Code: 215
Error Message: Bas Authentication Error
 
# License

DemoTwitterApp is released under [MIT License](https://opensource.org/licenses/MIT).

