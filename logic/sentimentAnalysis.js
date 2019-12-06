var Sentiment  = require('sentiment');
var trainingData = require('./training');

module.exports = function(full_text) {
  var sentiment = new Sentiment();
  var options = {
    extras: trainingData
  };
  
  return sentiment.analyze(full_text, options);
};