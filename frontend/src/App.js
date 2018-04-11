import React, { Component } from 'react';
import TwitterLogin from 'react-twitter-auth';
//import Tweet from 'react-twitter-widgets';
const twitterConfig = require('./twitter.config.js');
const jsSHA = require('jssha');

/***********************************************************************************

=> functions used to generate the parameters to authenticate the API call

1. percentEncode(str)
2. genSortedParamStr(params, key, token, timestamp, nonce)
3. hmac_sha1(string, secret)
4. oAuthBaseString(method, url, params, key, token, timeStamp, nounce)
5. oAuthSigningKey(consumer_secret, token_secret)
6. oAuthSignature(base_string, signing_key)

************************************************************************************/

class App extends Component {

  constructor() {
    super();

    this.state = { isAuthenticated: false, user: null, token: '', searchTweet: 'donald'};
  }
  
  //to covert a string to url encoded format
  percentEncode = (str) => {
    return encodeURIComponent(str).replace(/[!*()']/g, (character) => {
      return '%' + character.charCodeAt(0).toString(16);
    });
  };
  
  //to merge objects
  mergeObjs = (obj1, obj2) => {
      for (var attr in obj2) {
          obj1[attr] = obj2[attr];
      }
      return obj1;
  };
  
  //to generate string from sorted parameters
  genSortedParamStr = (params, key, token, timestamp, nonce) => {
      var paramObj = this.mergeObjs(
          {
              oauth_consumer_key : key,
              oauth_nonce : nonce,
              oauth_signature_method : 'HMAC-SHA1',
              oauth_timestamp : timestamp,
              oauth_token : token,
              oauth_version : '1.0',
              'include_entities': 'true'
          }
      );

      var paramObjKeys = Object.keys(paramObj);
      paramObjKeys.sort();
      var len = paramObjKeys.length;
      var paramStr = paramObjKeys[0] + '=' + paramObj[paramObjKeys[0]];
      for (var i = 1; i < len; i++) {
          paramStr += '&' + paramObjKeys[i] + '=' + this.percentEncode(decodeURIComponent(paramObj[paramObjKeys[i]]));
      }
      return paramStr;
  };
  
  
  hmac_sha1 = (string, secret) => {
      let shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.setHMACKey(secret, "TEXT");
      shaObj.update(string);
      let hmac = shaObj.getHMAC("B64");
      return hmac;
  };
  
  //to generate OAuth base string
  oAuthBaseString = (method, url, params, key, token, timeStamp, nounce) => {
    return method + "&" + this.percentEncode(url) + "&" + this.percentEncode(this.genSortedParamStr(params, key, token, timeStamp, nounce));
  };
  
  //to generate OAuth signing key
  oAuthSigningKey = function(consumer_secret, token_secret) {
      return consumer_secret + '&' + token_secret;
  };
  
  //to generate OAuth signature
  oAuthSignature = function(base_string, signing_key) {
      var signature = this.hmac_sha1(base_string, signing_key);
      return this.percentEncode(signature);
  };
  
  
  //on click event for a button click to refresh tweets (toggle between Donald Trump's tweet and Hillary Clinton's tweet)
  refreshTweet = () => {
    //time stamp generated for authentication
    var timeStamp = Math.round(Date.now() / 1000);  
    var nounce = btoa(twitterConfig.consumerKey + ":" + timeStamp);     //generate OAuth nonce
    var baseString = this.oAuthBaseString("POST", "https://api.twitter.com/1.1/search/tweets.json?q=donald%20trump", "include_entity=true", ""+twitterConfig.consumerKey, ""+twitterConfig.accessTokenKey, ""+timeStamp, ""+nounce);     //generate base string
    var signingKey = this.oAuthSigningKey(twitterConfig.consumerSecret, twitterConfig.accessTokenSecret);   //generate signingKey
    var signature  = this.oAuthSignature(baseString, signingKey);   //generate signature

    var url = "http://localhost:4000/api/v1/search/tweet1";     //url to contact server for a API call to twitter to fetch the tweets
    var params = "Oauth%20oauth_consumer_key=" + twitterConfig.consumerKey + "'&oauth_nonce='" + nounce + "'&oauth_signature='" + signature + "'&oauth_signature_method='HMAC-SHA1'&oauth_timestamp='" + timeStamp + "'&oauth_token='" + twitterConfig.accessTokenKey + "'&oauth_version='1.0'";    //parameters needed to authenticate API call
    
    //fetch call to server url
    fetch(url, {
        method: 'POST',
        headers: {
            authorization: params,
            searchTweet: this.state.searchTweet
        }
    })
    .then((response) => response.json())
    .then((responseData) => {
        console.log(responseData);      //print the response on the console
    }).catch((error) => {
        console.log(error);
    });
    
    //toggle Trump's tweet and Clinton's tweet
    if(this.state.searchTweet=="donald"){
        this.setState({searchTweet: "hillary"});
    } else {
        this.setState({searchTweet: "donald"});
    }
  };  
  
  
  //event binding when user successfully logged in
  onSuccess = (response) => {
    const token = response.headers.get('x-auth-token');
    
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, user: user, token: token});
        this.refreshTweet();    //initially show Donald Trump's tweet
      }
    });
  };
    
  //event binding when user failed to log in
  onFailed = (error) => {
    alert(error);
  };

  //function to logout from Twitter
  logout = () => {
    this.setState({isAuthenticated: false, token: '', user: null, searchTweet: ''})
  };
    
  

  render() {
    var searchTweet = this.state.searchTweet;   //to get the current search name to get the tweets
    let content = !!this.state.isAuthenticated ?    
      (
        <div>
          <p>Authenticated</p>
          <div>
            {this.state.user.email}
          </div>
          {searchTweet=="donald" ? (
                <button onClick={this.refreshTweet} className="button" >
                  Donald Trump Tweets
                </button> 
              ) : (
                <button onClick={this.refreshTweet} className="button" >
                  Hillary Clinton Tweets
                </button>
              )
          }
          <div>
           
          </div>
          <div>
            <button onClick={this.logout} className="button" >
              Log out
            </button>
          </div>
        </div>
      ) :
      (
        <TwitterLogin loginUrl="http://localhost:4000/api/v1/auth/twitter"
                      onFailure={this.onFailed} onSuccess={this.onSuccess}
                      requestTokenUrl="http://localhost:4000/api/v1/auth/twitter/reverse"/>
      );

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
