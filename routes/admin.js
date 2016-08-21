/**
 * Created by chojeaho on 2016-08-03.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var http = require('http');
var url = require('url');

var key = {
    user:'',
    password:'',
    db:'USE Company',
    table:'SELECT * FROM utaha',
    find:'WHERE id LIKE',
    autoIncrement : 'SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = "Company" AND TABLE_NAME = "utaha"',
    insert :'INSERT INTO utaha (name,url,img,doc) VALUES ',
    admin : 'admin'
 };

var client = mysql.createConnection({
    user : key.user,
    password: key.password
});

client.query(key.db); //USE TABLE

router.get('/', function(req, res, next) {
    //res.send('admin');
    var uri = req.url;
    var query = url.parse(uri,true).query;
    if (req.method == 'GET' || query.password != null) {
        if(query.password == key.admin) {
            client.query(key.table, function (error, results) { //SELECT TABLE
                if (error) {
                    console.log(error);
                } else {
                    //res.end('under construction');

                    console.log('---------db connected');
                    res.render('admin', {title: 'Express', data: results});
                }
            });
        }else {
            res.end('wrong password');
        }
    }
});

router.post('/',function (req,res) {
    console.log(req.body);
    var IdNum; //AUTO INCREMENT id 값
    client.query(key.autoIncrement,function (error,results) {
        if (error)
        {
            console.log('DB ---------------autoincrement error  '+error);
            res.send('DB error');
        }else{
            //req.body.title = req.body.title.replace(/'/g, "\\'");
            //req.body.content = req.body.content.replace(/'/g, "\\'"); // TODO:'문자 사용
            idNum = JSON.parse(JSON.stringify(results))[0].AUTO_INCREMENT; 
            client.query(key.insert + "( "+ client.escape(req.body.title)+",'"+"http://localhost:3000/post?id="+idNum+"','"+/*req.body.img */" "+ "',"+ client.escape(req.body.content) +");",function (error,result) {
                if(error)
                {
                    console.log('DB ---------------insert error  '+error+'--'+key.insert);
                    res.send('DB error');
                }else{
                    console.log('DB ---------------insert DB complete!');
                    res.send('complete!');
                }
            });
        }
    });
});

module.exports = router;