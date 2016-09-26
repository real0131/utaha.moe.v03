/**
 * Created by chojeaho on 2016-08-03.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var http = require('http');
var url = require('url');
var xss = require('xss');
var fs = require('fs');
var app = express();
var client;

var key = {
    user:'root',
    password:'',
    db:'USE db',
    table:'SELECT * FROM utaha',
    find:'WHERE id LIKE',
    autoIncrement : 'SELECT AUTO_INCREMENT FROM ' +
    'information_schema.TABLES WHERE TABLE_SCHEMA = "db" ' +
    'AND TABLE_NAME = "utaha";',
    insert :'INSERT INTO utaha (name,url,img,doc) VALUES ',
    update : 'UPDATE utaha SET ',
    admin : 'admin',
    url : 'http://utaha.moe/post?id='
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

router.post('/form_author',function (req,res) { //insert
    console.log(req.body);
    var IdNum; //AUTO INCREMENT id 값
    client.query(key.autoIncrement,function (error,results) {
        if (error)
        {
            console.log('DB ---------------autoincrement error  '+error);
            res.send('DB error');
        }else{
            console.log(req.body);
            idNum = JSON.parse(JSON.stringify(results))[0].AUTO_INCREMENT;
            req.body.content = xss(req.body.content);
            req.body.title = xss(req.body.content);
            client.query(key.insert + "( "+ client.escape(req.body.title)+",'"+key.url+idNum+"','"+/*req.body.img */" "+ "',"+ client.escape(req.body.content) +");",function (error,result) {
                if(error)
                {
                    console.log('DB ---------------insert error  '+error+'--'+key.insert);
                    res.send('DB error');
                }else{
                    console.log('DB ---------------insert DB complete!');
                    res.redirect("/");
                }
            });
        }
    });
});

router.post('/form_img', function (req,res) { //img
    console.log(__dirname+'\\temp\\'+req.files.img.path);
    exports.upload = function(req, res){
        fs.readFile(req.files.img.path,function(error,data){
            var destination = __dirname + '\\temp\\'+ req.files.img.name;
            fs.writeFile(destination,data,function(error){
                if(error){
                    console.log(error);
                    throw error;
                }else{
                    res.redirect('back');
                }
            });
        });
    };
});

router.post('/form_update', function (req,res) { //update
    console.log(req.body);
    req.body.id = Number(req.body.id);
    req.body.update_title = xss(req.body.update_title);
    req.body.update_content = xss(req.body.update_content);
    if(Number.isInteger(req.body.id)){
        if(req.body.update_title==''){ //title이 없을때
            client.query(key.update+"doc="+client.escape(req.body.update_content)+" WHERE id="+req.body.id+";",function (error,result) {
                if(error)
                {
                    console.log('update error------------'+error);
                    res.send('DB error');
                }else {
                    console.log('db'+req.body.id +' doc update complete');
                    res.redirect("/");
                }
            });
        }else{ //title이 있을때(title도 수정할때)
            client.query(key.update+"name="+client.escape(req.body.update_title)+",doc="+client.escape(req.body.update_content)+" WHERE id="+req.body.id+";",function (error,result) {
                if(error)
                {
                    console.log('update error------------'+error);
                    res.send('DB error');
                }else {
                    console.log('db'+req.body.id +' title doc update complete');
                    res.redirect("/");
                }
            });
        }
    }
});

router.get('/form_delete', function (req,res) { //delete
    var uri = req.url;
    var query = url.parse(uri,true).query;
    console.log('asdf'+query);
    query.id = Number(query.id);
    query.password = xss(query.password);
    if(query.id!=null && query.password == key.admin)
    {
        client.query('DELETE FROM utaha WHERE id='+ query.id +';',function (error,result) {
           if(error)
           {
               console.log('db delete error ----------'+error);
               res.end('delete error');
           }else {
               res.redirect("/");
           }
        });
    }else {
        res.end('password is wrong');
    }
});

module.exports = router;