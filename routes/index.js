var express = require('express');
var router = express.Router();
var mysql = require('mysql');



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

router.get('/test', function(req, res, next) {
  res.render('post', { title: 'Express'});
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express'});
});
module.exports = router;
