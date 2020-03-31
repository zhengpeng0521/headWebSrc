var express = require('express');
var bodyParser = require("body-parser");
var routes = require('./post_service');
var app = express();

app.use(express.static('public'));

var root_html_path =  __dirname + "/public/html/";

//异步请求数据转发
app.all('/service', routes.postService);

app.get('/h5/', function (req, res) {
   res.sendFile( root_html_path + "index.html" );
});

app.get('/h5/404', function (req, res) {
   res.sendFile( root_html_path + "404.html" );
});

var server = app.listen(6565, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("服务器已启动，访问地址为 http://%s:%s", host, port)

});
