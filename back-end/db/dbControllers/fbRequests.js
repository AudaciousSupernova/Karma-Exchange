var request = require('request');


//<h3> Get Facebook Data Function </h3>

var getFacebookData = function() {
  var friends
  var pictures = 0;
  var posts = 0;
    request('https://graph.facebook.com/v2.2/me/friends/?access_token=CAAK6H5Q1fAgBAKSlSCZBlK3Ce091FV8UnfTAKbdIZCvu7tK2GLJfXqzKnJOgZBsu3G3gdqEfkhuQ9xaPxpNeJ2sfZAAqCRBYHZCYdporyZAkeZCa12McSkz0kvysPHxLqpB8OgOZAfgZB8B2ZAHmJqZCZBZCmY2NfLxTGEZCuX8Sg0XKo4QSEqh8VMbEANSPSGJ87YphgklTaRb4jEOQZDZD', function (error, response, body) {
      friends = JSON.parse(body).summary.total_count;
      console.log(friends);
    });

    request('https://graph.facebook.com/v2.2/me/photos/?access_token=CAAK6H5Q1fAgBAKSlSCZBlK3Ce091FV8UnfTAKbdIZCvu7tK2GLJfXqzKnJOgZBsu3G3gdqEfkhuQ9xaPxpNeJ2sfZAAqCRBYHZCYdporyZAkeZCa12McSkz0kvysPHxLqpB8OgOZAfgZB8B2ZAHmJqZCZBZCmY2NfLxTGEZCuX8Sg0XKo4QSEqh8VMbEANSPSGJ87YphgklTaRb4jEOQZDZD', function (error, response, body) {
      pictures += JSON.parse(body).data.length;
      console.log(pictures)
    });

    request('https://graph.facebook.com/v2.2/me/posts/?access_token=CAAK6H5Q1fAgBAKSlSCZBlK3Ce091FV8UnfTAKbdIZCvu7tK2GLJfXqzKnJOgZBsu3G3gdqEfkhuQ9xaPxpNeJ2sfZAAqCRBYHZCYdporyZAkeZCa12McSkz0kvysPHxLqpB8OgOZAfgZB8B2ZAHmJqZCZBZCmY2NfLxTGEZCuX8Sg0XKo4QSEqh8VMbEANSPSGJ87YphgklTaRb4jEOQZDZD', function (error, response, body) {
      posts += JSON.parse(body).data.length;
      console.log(posts);
    });
}

module.exports = {
  getFacebookData: getFacebookData
}

