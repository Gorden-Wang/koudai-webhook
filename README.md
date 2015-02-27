## webhook for gitlab 
* 跨服务器部署 ：gitserver 和 测试服务器不在一起
* gitserver部署NodeJS webhook
* 测试服务器部署httpserver
* abc.json 配置信息

## 服务器配置
* 安装Node
* clone 源代码
* 配置abc.json 
* node server.js
* 配置gitlab webhook

## 配置abc.json
* desdir  --->  临时目录地址，checkout的代码会放在这里，准备拷贝
* deployUrl ----> 部署地址 ，会从desdir下的build拷贝到deployUrl中
* logUrl -----> @TODO

## TODO
* deploy更灵活，部署单个目录，而不是整个build下最后一次修改。
* Log
