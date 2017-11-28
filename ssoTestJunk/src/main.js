/*global __dirname */
const fs = require('fs');
const Guid = require('guid');
const express = require('express');
const bodyParser = require("body-parser");
const Mustache  = require('mustache');
const Request  = require('request');
const Querystring  = require('querystring');
const path = require('path');
const LocalStorage = require('node-localstorage').LocalStorage;
const app = express();

localStorage = new LocalStorage('./scratch');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  
var csrf_guid = Guid.raw();
const account_kit_api_version = 'v1.0';
const app_id = '148416749076090';
const app_secret = '8de94776e493a9a6469e4978205a91ad';
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.0/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.0/access_token'; 

app.use(express.static(path.join(__dirname, 'public')));

function loadLogin() {
  return fs.readFileSync(path.join(__dirname, 'public/views/login.html')).toString();
}

app.get('/', function(request, response){
  var view = {
    appId: app_id,
    csrf: csrf_guid,
    version: account_kit_api_version,
  };

  var html = Mustache.to_html(loadLogin(), view);
  response.send(html);
});

function loadLoginSuccess() {
  return fs.readFileSync(path.join(__dirname, 'public/views/login_success.html')).toString();
}

app.post('/login_success', function(request, response){
      // CSRF check
      if (request.body.csrf === csrf_guid) {

         if(request.body.name != "fblogin"){ //Check what kind of login was used
            var app_access_token = ['AA', app_id, app_secret].join('|');
            var params = {
               grant_type: 'authorization_code',
               code: request.body.code,
               access_token: app_access_token
            };

            // exchange tokens
            var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
            Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
               var view = {
                  user_access_token: respBody.access_token,
                  expires_at: respBody.expires_at,
                  user_id: respBody.id,	
               };

               // get account details at /me endpoint
               var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
               Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {
                  // send login_success.html
                  if (respBody.phone) {
                     view.phone_num = respBody.phone.number;
                  } else if (respBody.email) {
                     view.email_addr = respBody.email.address;
                  }
                  var html = Mustache.to_html(loadLoginSuccess(), view);
                  response.send(html);
               });
            });

         }else{//Facebook Login
            var values = request.body.value.split(",");
            localStorage.setItem('uid', values[0]);
            localStorage.setItem('tkn', values[1]);

            var view = {
               user_access_token: values[1], 
               user_id: values[0],
            };
            console.log(values);
            var html = Mustache.to_html(loadLoginSuccess(), view);
            response.send(html);
         }
      } 
      else {
      // login failed
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end("Something went wrong. :( ");
      }
});

app.use(function(req, res, next)
{
   res.status(404);
   //console.log("404 - Request for " + req.url);
});

app.listen(80, function()
{
   console.log("Server running at http://127.0.0.1:80/");
});
