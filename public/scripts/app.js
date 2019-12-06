$(document).ready(function() {
  
  $('#searchText').on('keypress', function(e) {
    if (e.which == 13 || e.keyCode == 13) {
      if ($(this).val().trim().length > 0) {
        $('.potatoImg').addClass('hidden');
        triggerTwitterSrv($(this).val().trim());
      }
    }
  });

  function triggerTwitterSrv(text) {
    $.ajax({
      type: 'POST',
      url: '/search',
      data: {
        search: text
      },
      beforeSend: function(xhr) {
        $('.tweet-results').html('');
        $('.results').show();
        enableState();
      },
      success: parseData,
      error: oops
    });
  }

  function parseData(data) {
    disableState();
    var source = $("#document-template").html();
    var template = Handlebars.compile(source);
    var templateObject = [];
    var cooperativeSum = 0;
    for (var i = 0; i < data.length; i++) {
      var s = data[i].sentiment,
          t = data[i].tweet;

      var _o = {
        imgSrc: t.user.profile_image_url,
        name: t.user.name,
        tweetLink: 'http://twitter.com/' + t.user.screen_name + '/status/' + t.id_str,
        tweet: "undefined" != typeof(t["retweeted_status"]) ? _retweeted = t["retweeted_status"]["full_text"] : t.full_text,
        created_at: t.created_at ? new Date(t.created_at) : '--',
        score: s.score ? s.score : '--',
        negativeResult: s.score < 0,
        neutralResult: s.score < 2,
        positiveResult: s.score >= 2,
        comparative: s.comparative ? s.comparative : '--',
        favorited: t.favorite_count ? t.favorite_count : 0,
        retweet: t.retweet_count ? t.retweet_count : 0,
        wordsMatched: s.words && s.words.length ? s.words : '--',
        positiveWords: s.positive && s.positive.length ? s.positive : '--',
        negativeWords: s.negative && s.negative.length ? s.negative : '--'
      };
      templateObject.push(_o);   
      cooperativeSum += s.comparative;
    };
    $('.potatoImg').addClass('hidden');
    (cooperativeSum < 0 ) ? $('.negativePotato').removeClass('hidden') : (cooperativeSum < 2 ) ? $('.neutralPotato').removeClass('hidden') : $('.positivePotato').removeClass('hidden'); 
    var html = template(templateObject);
    $('#TweetResults').html(html);
  }

  function oops(data) {
    $('.error').show();
    disableState();
  }

  function disableState() {
    $('.loading').hide();
    $('#TweetResults').html('');
    $('#searchText').prop('disabled', false);
  }

  function enableState() {
    $('.loading').show();
    $('#searchText').prop('disabled', true);
  }
});