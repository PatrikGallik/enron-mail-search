'use strict';

var fs = require('fs');
var path = require('path');
var camelCase = require('camel-case');
var glob = require('glob');
var moment = require('moment');

var dir = process.argv.splice(2)[0];

var flags = [
  'Message-ID',
  'Date',
  'From',
  'Subject',
  'Cc',
  'Mime-Version',
  'Content-Type',
  'Content-Transfer-Encoding',
  'Bcc',
  'X-From',
  'X-To',
  'X-cc',
  'X-bcc',
  'X-Folder',
  'X-Origin',
  'X-FileName'
];

function parseFile(filename) {

  //console.log('[debug] Parsing file: ', filename)

  if (!fs.lstatSync(filename).isFile()) {
    return;
  }

  var content = fs.readFileSync(filename, 'utf-8');
  var parsedMail = {};

  // Match content
  var matchedContent = content.match(new RegExp('[\r\n]{3}((.|\r|\n)+)'));
  if (matchedContent) {
    content = content.substring(0, matchedContent.index);
    parsedMail.content = matchedContent[1];
  }

  // Match other data
  flags.forEach(flag => {
    var matchedFlag = content.match(new RegExp(flag + ': (.+)'));
    if (matchedFlag) {
      parsedMail[camelCase(flag)] = matchedFlag[1];
    }
  });

  // Match To field
  var matchedToField = content.match(new RegExp('To: ((.|\r|\n)+)Subject:'));
  if (matchedToField) {
    parsedMail.to = matchedToField[1].replace(/\s/g, '');
  }

  parsedMail.date = moment(parsedMail.date).format();

  return parsedMail;
}

'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
  var pattern = path.join(dir, letter + '*/*/*');
  console.log('[debug] Pattern:', pattern);

  glob(pattern, {}, function(err, files) {
    if (err) {
      return console.error('Error occured: ', err);
    }

    console.log('[debug] Files found for pattern: ', letter, files.length);

    var data = [];

    files.forEach(file => {
      data.push(parseFile(file));
    });

    // Export to elastic formatted json
    var exportString = '';

    data.forEach((item, index) => {
      exportString += '{"index":{"_id":"' + letter + '_' + index + '"}}\n';
      exportString += JSON.stringify(item) + '\n';
    });

    fs.writeFileSync(process.cwd() + '/export/' + letter + '.json', exportString);

    console.log('[debug] Data written.');
  });
});
