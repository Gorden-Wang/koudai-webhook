var http = require('http');
var util = require('./util/util.js');
var qs = require("querystring");
var url = require("url");
var fs = require("fs");
var exec = require('child_process').exec;
var jf = require('jsonfile')
var ut = require('util')


var port = 18080;
var util = new util();
var response;


(function () {
    function Deploy() {

    }

    Deploy.prototype = {
        init: function () {
            this.cacheData();
            this.creatHttpServer();
        },
        cacheData: function () {
            var that = this;
            var file = 'abc.json'

            console.log(ut.inspect(jf.readFileSync(file)))
            that.data = jf.readFileSync(file);
        },
        creatHttpServer: function () {
            var that = this;

            http.createServer(function (req, res) {
                var path = util.getPath(req);
                var param = util.getParam(req);
                var JSONP = util.getJSONPName(req);
                that.data.res = res;

                that.data.reqParam = "";
                req.addListener("data", function (postdata) {
                    console.log(postdata);
                    that.data.reqParam += postdata;


                });
                req.addListener("end",function(){
                    that._endHanderler();
                });

            }).listen(port);
        },
        _endHanderler: function () {
            var that = this;
            var res = that.data.res;
            if(!that.data.reqParam){
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end();
                return;
            }
            console.log(res);
            var d = JSON.parse(that.data.reqParam);
            var ref = d.ref;
            var u_name = d.user_name;
            var msg = d.commits[0].message;
            var rep_url = d.repository.homepage;


            //判断是不是普通提交，--deploy&project:XXX--为部署

            if (msg.indexOf("--deploy&project:") > -1) {
                that._deployHandler(d,res);

            }else{
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end();
            }



        },
        _deployHandler : function(data,res){
            var that = this;


            var rep_path = data.repository.homepage.match("youshop/(.+)") && data.repository.homepage.match("youshop/(.+)")[1];
            var branch = data.ref.match('refs/heads/daily/(.+)') && data.ref.match('refs/heads/daily/(.+)')[1];

            var sys = that.data.desdir || "/home/www/sys/";
            var des = that.data.deployUrl || "/home/www/sys/test";


            fs.exists(sys+rep_path,function(tag){

                if(tag == true){
                    //存在
                    var cmd = "cd "+sys+rep_path + " && git checkout daily/"+branch + "&& git pull";
                    console.log(cmd)
                    exec(cmd, function (err, stdout, stderr) {
                        if (err) {
                            console.log('exec error:' + stderr);
                        } else {
                            console.log(stdout);

                            //copy

                            exec("cd "+sys+rep_path + " && git archive --format=tar  HEAD build/ | (cd "+des+" && tar xf - ) && cd "+des+" && cp -Rf ./build/* ./ && rm -Rf build", function (err, stdout, stderr) {
                                if (err) {
                                    console.log('exec error:' + stderr);
                                } else {
                                    console.log(stdout);

                                    //copy




                                }
                            });


                        }
                    });

                }else{
                    var cmd ="cd "+sys + " && git clone "+ rep+".git && " + "cd "+sys+rep_path + " && git checkout daily/"+branch + " && git pull";
                    console.log(cmd)
                    exec(cmd, function (err, stdout, stderr) {
                        if (err) {
                            console.log('exec error:' + stderr);
                        } else {
                            console.log(stdout);
                        }
                    });

                }

                res.writeHead(200, {"Content-Type": "application/json"});
                res.end();
            });

        }

    }

    var d = new Deploy();
    d.init();


})();
