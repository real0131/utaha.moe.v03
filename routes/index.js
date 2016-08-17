var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var http = require('http');
var url = require('url');

var key = {
  
};

var client = mysql.createConnection({
  user : key.user,
  password: key.password
});

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
  }else {
    res.end('post');
  }
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express'});
});
module.exports = router;
