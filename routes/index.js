var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var http = require('http');
var url = require('url');
var client;

var key = {
  user:'root',
  password:'!',
  db:'USE db',
  table:'SELECT * FROM utaha',
  find:'WHERE id LIKE'
};

function handleDisconnect() {
  client = mysql.createConnection(key); // Recreate the connection, since
  // the old one cannot be reused.

  client.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  client.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                 // server variable configures this)
    }});
}

handleDisconnect();


client.query(key.db);

/* GET home page. */
router.get('/', function(req, res, next) {
  client.query(key.table,function (error, results) {
    if (error) {
      console.log(error);
    }else {
      res.render('index', { title: 'Express', data : results });
    }
    });
});

router.get('/post', function(req, res, next) {
  var uri = req.url;
  var query = url.parse(uri,true).query;
  if (req.method == 'GET' || query.id != null)
  {
    client.query(key.table+" "+key.find+" "+query.id+"",function (error ,results) {
      if (error){
        console.log(error);
      }else{
        res.render('post', { title: 'Express' , data : results});
      }
    });
  }else if(req.body ==null){
    res.end('please input right query');
  }else{
    res.end('error');
  }
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express'});
});
module.exports = router;
