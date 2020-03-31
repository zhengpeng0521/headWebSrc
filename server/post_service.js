/*
 * 异步请求数据转发
 */
var qs = require('querystring');
var http = require('http');

exports.postService=function (req, res) {
//    console.log(req.body);
//    req.pipe(request.post(remoteUrl, {form: req.body})).pipe(res);
//    req.end();

    // Request of JSON data
    // 接收客户端的JSON数据
    var reqJosnData = qs.stringify(req.body);

    var postheaders = {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : Buffer.byteLength(reqJosnData, 'utf8')
    };
    var optionspost = {
        host : '192.168.1.22',
        port : '8080',
        path : '/omp-web/loginController/loginQRCode',
        method : 'POST',
        headers : postheaders
    };
    var reqPost = http.request(optionspost, function(resPost) {
        resPost.on('data', function(data) {
            res.send(data);
        });
    });

    // write the json data
    // 发送REST请求时传入JSON数据
    reqPost.write(reqJosnData);
    reqPost.end();
    reqPost.on('error', function(e) {
        res.status(500).send(e);
    });
}
