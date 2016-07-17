'use strict';

var request = require('request');
var fs = require('file-system');
var builder = require('xmlbuilder');
var parseString = require('xml2js').parseString;


exports.uploadAppealLevel = function (req, res) {
  var urlstring = 'http://xrpslud8931a.hcadev.corpaddev.net/AppealOnBaseService/OnBaseService.svc/commitOnBase';
  var userName = req.session.userName;
  var signatureFile = req.files.file;
  var bitmap = fs.readFileSync(signatureFile.path);
  var base64Byte = new Buffer(bitmap).toString('base64');
  var xml = builder.create('ns0:SendFileReq')
    .att('xmlns:ns0', 'http://http://Parallon.AppealsAutomation.Schemas.SendFileReq')
    .ele('FileStream', base64Byte)
    .up()
    .ele('User34', userName)
    .end({ pretty: true});
  request({
    url: urlstring,
    method: 'POST',
    xml:true,
    body: xml
  }, function (err, response, body) {
    console.log('body..'+body);
    if (err) {
      console.log('Something went wrong on  the Service');
      res.send(500).send('Uknown Error');
    } else {
      parseString(body.toString(), {trim: true}, function (err, result) {
        console.log('result...'+JSON.stringify(result['ns0:RcvResponse']));
        console.log('result...'+result['ns0:RcvResponse'].HasErrors);

          if (result['ns0:RcvResponse'] && result['ns0:RcvResponse'].HasErrors && result['ns0:RcvResponse'].HasErrors[0] === 'true') {
            res.status(400).send(result['ns0:RcvResponse'].StatusMessage[0]);
          } else {
            res.status(200).send('Sucess');
          }
        });
      }
    });
};
