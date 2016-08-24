/**
 * Created by chojeaho on 2016-08-03.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var http = require('http');
var url = require('url');
var client;

var key = {
    user:'root',
    password:'',
    db:'USE Company',
    table:'SELECT * FROM utaha',
    find:'WHERE id LIKE',
    autoIncrement : 'SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = "Company" AND TABLE_NAME = "utaha";',
    insert :'INSERT INTO utaha (name,url,img,doc) VALUES ',
    admin : 'admin'
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