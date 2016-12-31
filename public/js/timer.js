var time = {
    unix : 1485788400,
    year : 2017,
    month : 1,
    date : 31
};
var d = new Date();

var timer = function () {
    var result = time.unix - (Date.now()/1000);
    
    if (d.getMonth()==time.month&&d.getDate() == time.date){
        //finish inner html
        clearInterval(refresh);
    }else{
        document.getElementById('event-time').innerHTML=
            Math.floor(result/86400)+" : "
            + Math.floor(result%86400/3600)+" : "
            + Math.floor(result%86400%3600/60)+" : "
            + Math.floor(result%86400%3600%60);
    }
};

var refresh = setInterval(timer,100);