'use strict';

var request = require('request');
var BufferList = require('bl');
var filesystem = require('file-system');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var props = require('../properties');

var _TMPFILE_TTL_MINUTES = 5;
var _TMPDIR = props.getProperty('TMPDIR');

var _delayedFileDeletion = function(filename) {
	setTimeout(function() {
    fs.exists(filename, function(exists) {
      if (exists) {
        console.log('File deleted - ' + filename);
        fs.unlink(filename);
      } else {
        console.log('Error deleting file - ' + filename);
      }
    });
	}, _TMPFILE_TTL_MINUTES*60000);
};

exports.downloadAppealLevel = function (req, res) {

  var parameterId = req.params.id;
  var userName = req.session.userName;
  var bodyjson =  req.body;
      bodyjson.User34 = userName;
  console.log('Session Data...downloadAppealLevel api' + userName);
  console.log('JSON Body...downloadAppealLevel api ' + JSON.stringify(bodyjson));
  // TODO: Abstract these into ENV vars...
   var urlString =  'http://XRPSLUD8931A.hcadev.corpaddev.net/AppealService/AppealService.svc/getappeal';
  //var urlString = 'http://xrpswpappbiz04b/AppealService/AppealService.svc/getAppeal'; // PROD
  console.log("Url String"+urlString);

  var bl = new BufferList();
  request({
    url: 'http://XRPSLUD8931A.hcadev.corpaddev.net/AppealService/AppealService.svc/getappeal',
    method: 'POST',
    json:true,
    responseBodyStream: bl,
    body: bodyjson,
    headers: {
      'InstanceID':parameterId
    }
  }, function (err, response, body){
    if (err || response.statusCode !== 200) {
      console.log('Something went wrong with the download service.'+err);
      console.log(body);
      res.json(500, {message: 'An error occurred with the download service.'});
    } else { // Status Codes other than 2xx
      var path = _TMPDIR + '/' + parameterId+'.doc';
      //console.log("Body: "+body);
      parseString(body.toString(), {trim: true}, function (err, result) {
        if(result['ns0:AppealResponse'] && result['ns0:AppealResponse'].ResponseBase64 && result['ns0:AppealResponse'].ResponseBase64[0] !== 'Null') {
          var bodyjson = result['ns0:AppealResponse'].ResponseBase64[0];
          var buf = new Buffer(bodyjson, 'base64');
          fs.open(path, 'w', function(err, fd) {
            if (err) {
              res.json(500, {message: 'An error occurred with the selected file.'});
            }
            filesystem.write(fd, buf, 0, buf.length, null, function(err) {
              if (err){
                res.json(500, {message: 'An error occurred writing the file.'});
                throw 'error writing file: ' + err;}
              filesystem.close(fd, function() {
                _delayedFileDeletion(path);
                var _url = path.replace(_TMPDIR, '');
                res.json({path:'/download/' + _url});
              });
            });
          });
        }else if(result['ns0:AppealResponse'].HasErrors  && result['ns0:AppealResponse'].StatusMessage) {
          res.json(500, {message: result['ns0:AppealResponse'].StatusMessage[0]});
        }else{
          res.json(500, {message: 'An unknown error occurred with the download service.'});
        }
      });
    }
  });
};
