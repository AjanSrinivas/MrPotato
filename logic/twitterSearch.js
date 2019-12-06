var twitter = require('twitter'),
    sentimentAnalysis = require('./sentimentAnalysis'),
    db = require('diskdb');

db = db.connect('db', ['sentiments']);

var config = {
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
};

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = [];

  twitterClient.get('search/tweets', {q: text, tweet_mode: "extended", lang: 'en'}, function(error, data, response) {
    for (var i = 0; i < data.statuses.length; i++) {
              var resp = {};
              var _currentStatus = data.statuses[i];
              resp.tweet = _currentStatus;
              var _retweeted = _currentStatus.full_text;
              "undefined" != typeof(_currentStatus["retweeted_status"]) ? _retweeted = _currentStatus["retweeted_status"]["full_text"] : '';
              resp.sentiment = sentimentAnalysis(_retweeted);
              // console.log(resp.sentiment);
              dbData.push({
                tweet: resp.tweet,
                sentiment: resp.sentiment
              });
              response.push(resp);
              
            };
            // db.sentiments.save(dbData);
            callback(dbData);
    });
}