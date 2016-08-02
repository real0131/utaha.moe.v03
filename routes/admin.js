/**
 * Created by chojeaho on 2016-08-03.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    //res.send('admin');
    res.render('admin', { title: 'Express' });
});

module.exports = router;