/**
 * Created by chojeaho on 2016-08-03.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var key = {
 };

var client = mysql.createConnection({
    user : key.user,
    password: key.password
});

client.query(key.db); //USE TABLE

router.get('/', function(req, res, next) {
    //res.send('admin');
    client.query(key.table,function (error, results) { //SELECT TABLE
        if (error)
        {
            console.log(error);
        }else{
            res.end('under construction');
            /*
            console.log('---------db connected');
            res.render('admin', { title: 'Express', data : results });*/
        }
    });
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
            req.body.title = req.body.title.replace("'", "\'");
            req.body.content = req.body.content.replace("'", "\'"); // TODO:'문자 사용
            idNum = JSON.parse(JSON.stringify(results))[0].AUTO_INCREMENT; 
            client.query(key.insert + "( '"+ client.escape(req.body.title)+"','"+"http://localhost:3000/post?id="+idNum+"','"+/*req.body.img */" "+ "','"+ client.escape(req.body.content) +"');",function (error,result) {
                if(error)
                {
                    console.log('DB ---------------insert error  '+error);
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