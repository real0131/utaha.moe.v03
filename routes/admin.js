/**
 * Created by chojeaho on 2016-08-03.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');



var client = mysql.createConnection({
    user : key.user,
    password: key.password
});

client.query(key.db);

router.get('/', function(req, res, next) {
    //res.send('admin');
    client.query(key.table,function (error, results) {
        if (error)
        {
            console.log(error);
        }else{
            console.log('---------db connected');
            console.log(results);
            res.render('admin', { title: 'Express', data : results });
        }
    });
});

module.exports = router;