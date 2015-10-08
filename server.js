var express         = require('express');
var app             = express();

var Ddos = require('ddos')
var ddos = new Ddos({maxexpiry: 40});

var bodyParser      = require('body-parser');

var mongoose        = require('mongoose');

var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var csrf            = require('csurf');

var _               = require('underscore');
var config          = require('./config/db');

var Search          = require('./app/models/search');

// protect against mongo script injections
var sanitize        = require('mongo-sanitize');
var clean           = sanitize('req.param.searchTerm');

var port            = process.env.PORT || 8080;
// twitter credentials
var Twitter         = require('twitter');
var client          = new Twitter({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:    process.env.TWITTER_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});
// connecting to database
mongoose.connect( process.env.MONGOLAB_URI || config.database);

app.set('superSecret', config.secret);
// applying security elements to the app

app.use(ddos.express);
app.use(cookieParser(config.cookieSecret, { httpOnly: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    name: 'sessionID',
    secret: config.secret,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 3600000
    },
    rolling: true,
    resave: false,
    saveUninitialized: true
}));
app.use(csrf());
app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// ======================================
// =            Routes                  =
// ======================================

var apiRoutes = express.Router();
// gets the saved queries in the database
apiRoutes.get('/saved-searches', function(req, res) {
  var queries = Search.find({}, function(err, q) {
    if (err) throw err;
    res.json(q);
  });
});

// gets tweets based on the user query
apiRoutes.get('/search',function(req, res) {

  var queryTerm = req.query['searchTerm'];
  var newSearch = new Search({
    text: queryTerm
  });


  newSearch.save(function(err) {
    if (err) throw err;

    console.log('Search saved successfully');
  });
  // using twitter client to retrieve 100 tweets matching query term
  client.get('search/tweets', {count: 100, q: queryTerm},
    function(error, tweets, response){

      var results = _.map(tweets['statuses'],
        function(tweet) {
          return {
            screenName: tweet['user']['screen_name'],
            pic: tweet['user']['profile_background_image_url'],
            tweet: tweet['text'],
            createdAt: tweet['created_at']
          };
        }
      );

      res.json(results);
    }
  );
});

app.use(express.static(__dirname + '/public'));

app.use('/twitter', apiRoutes);

app.listen(port);

console.log('Listening on http://localhost:' + port);
