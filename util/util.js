var qs = require("querystring");
var fs = require('fs');
//var xml2jsdriver = require('xml2js');
//var xml2js = xml2jsdriver.Parser;
//var js2xml = xml2jsdriver.Builder;
function util() {

}

util.prototype = {
    getPath: function (req) {
        var that = this,
            _arr = req.url.split("?");

        return _arr[0];
    },
    getParam: function (req) {
        var that = this,
            _arr = req.url.split("?");
        return qs.parse(_arr[1]);
    },
    getRequestParam: function (param, uri) {
        var value;
        uri = uri || window.location.href;
        value = uri.match(new RegExp('[\?\&]' + param + '=([^\&\#]*)([\&\#]?)', 'i'));
        return value ? decodeURIComponent(value[1]) : value;
    },
    getJSONPName: function (req) {
        var that = this;
        return that.getParam(req).callback
    },
    makeJSONP: function (name, data) {
        return name + "(" + JSON.stringify(data) + ")";
    },
    filterHTML: function (data) {
        return data.replace(/<(\S*?) [^>]*>.*?<\/\1>|<.*? \/>/, '').replace(" ", "").replace(/\n/, '');
    },
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "").replace(/\n/, '');
    },
    findStatic: function (pa, callback) {
        var that = this;
        fs.readFile("./www/src/" + pa, {encoding: 'utf-8'}, function (err, data) {
            if (err) {
                //TODO error
            }
            callback(data);
        });

    },
    getIntervalTime: function (hour) {
        hour = hour || 3;
        var date = new Date();
        var hours = date.getHours();
        var next = hours > hour ? hour + 24 - hours : hour - hours;
        return hour * 3600 * 1000;
    },
    console: {
        log: function (str) {
            var date = new Date();
            var now = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
            console.log(now + "\t" + str);
        }
    }



}

module.exports = util;
