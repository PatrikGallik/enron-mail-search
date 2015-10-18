var express = require('express');
var elasticsearch = require('elasticsearch');
var moment = require('moment');
var bodyParser = require('body-parser');
var app = express();

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.set('view engine', 'jade');

app.use(bodyParser.json({limit: '50mb'}));

app.get('/', function (req, res) {
  res.render('index', {});
});

app.post('/search', function(req, res) {

  console.log(req.body);

  var body = {
    query: {
      bool: {
        should: []
      }
    },
    highlight: {
      fields : {
        content: {}
      }
    }
  }

  if (req.body.text) {
    body.query.bool.should.push({ "match": { "content":  req.body.text }});
  }

  if (req.body.name1) {
    body.query.bool.should.push({ "match": { "from":  req.body.name1 }});
  }

  if (req.body.name2) {
    body.query.bool.should.push({ "match": { "to":  req.body.name2 }});
  }

  if (req.body.dateFrom || req.body.dateTo) {
    body.filter = {
      range: {
        date: {
          gte: req.body.dateFrom ? req.body.dateFrom : null,
          lte: req.body.dateTo ? req.body.dateTo : null
        }
      }
    }
  };

  client.search({
    index: 'enron',
    type: 'mail',
    body: body
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
