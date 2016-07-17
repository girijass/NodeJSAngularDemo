'use strict';

var httpntlm = require('httpntlm');

var _passportVerification = function(orgUserName, callback) {
  var _passportUrl = process.env.passportUrl || 'http://nadcwpwebpar02b.hca.corpad.net:81';
  var _serviceAccountName = process.env.serviceAccountName || 'ParaSvcBPAProd@hca.corpad.net';
  var _serviceAccountPassword = process.env.serviceAccountPassword || 'wx6RM53Az8J';
  var _query = _passportUrl + '/api/Permission/GetPermissions?strLanId=HCA\\' + orgUserName + '&strAppName=AppealAssistant';
  httpntlm.get({
    url: _query,
    username: _serviceAccountName,
    password: _serviceAccountPassword
  }, function (err, result){
    callback(err, result);
  });
};

exports.validateUser = function(req, res, next) {
  var sess = req.session.userName;
  console.log('Session Value is ' + JSON.stringify(sess));
  var _path = req.path;
  if (_path.indexOf('/api') === -1) {
    var _ntlmCredentials = req.ntlm;
    console.log('Response from NTLM: ' + JSON.stringify(_ntlmCredentials));
    var _response = {};
    _response.userPrincipal = req.ntlm; // {'DomainName':'MYDOMAIN','UserName':'MYUSER','Workstation':'MYWORKSTATION'}
    _passportVerification(_ntlmCredentials.UserName, function(err, result) {
      /*
      if (err) {
        console.log('Error ' + JSON.stringify(err));
      } else {
        console.log('Response from Passport ' + JSON.stringify(result));
      }
      */
      _response.passport = err || result;
     if(_response.passport.body){
       console.log('User Principal...' + _response.userPrincipal);
        req.session.userName = _response.userPrincipal.UserName;
        next();
      }
    });
  } else {
    console.log('Girija From Session...' + JSON.stringify(req.session.userName));
    next();
  }
};
