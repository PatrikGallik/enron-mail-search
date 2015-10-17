var express = require('express');
var elasticsearch = require('elasticsearch');
var app = express();

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', {});
});

app.get('/search', function(req, res) {
  client.search({
    index: 'enron',
    type: 'mail',
    body: {
      query: {
        match: {
          content: req.query.q
        },
      },
      highlight: {
        fields : {
          content: {}
        }
      }
    }
  }).then(function (resp) {
    res.json(resp.hits.hits.slice(0,10));
  }, function (err) {
    res.status(400).send(err);
  });
});

app.use(express.static('public'));

var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:' + server.address().port);
});
