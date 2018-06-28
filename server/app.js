var express = require('express');
var app = express();

//解决跨域
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function (req, res) {
    res.send('Hello World!');
  });

app.get('/getList', function (req, res) {

    //返回的json对象
    var obj = {
        code: 0,
        list: [
            { name: '苹果' },
            { name: '香蕉' },
            { name: '梨子' }
        ]
    };

    res.jsonp(obj);
});

app.post('/upload',function(req,res){
    console.log(req)
    var obj={
        code:0,
        data:null,
        message:''
    }
    res.jsonp(obj)
})

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});