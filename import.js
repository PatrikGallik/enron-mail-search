'use strict';

var request = require('request');
var fs = require('fs');

var letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
var index = 0;

function importFile(index) {
  if (index >= letters.length) {
    return;
  }

  var content = fs.readFileSync(process.cwd() + '/export/' + letters[index] + '.json', 'utf-8');

  console.log('[debug] Performing bulk request for letter ' + letters[index] + ' performed');

  request({
    method: 'POST',
    url: 'http://localhost:9200/enron/mail/_bulk?pretty',
    encoding: null,
    body: content
  }, function(error, request, body){
    if (error) {
      console.error('[error] Error when performing bulk request for ' + letters[index] + ':', error);
    }
    console.log('[debug] Bulk request for letter ' + letters[index] + ' performed');
    setTimeout(importFile(index + 1));
  });
}

importFile(index);