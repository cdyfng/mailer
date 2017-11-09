var fs = require('fs');
var readline = require('readline');
var filename = 'stockReminder.txt';
var mail = require('./common/mail');
var config = require('./config');
var _ = require('lodash');


var logsArr = new Array();
var listenArr = new Array();
function init() {
  sendHisLogs(filename, listenLogs);
}
function sendHisLogs(filename, listenLogs) {

  var rl = readline.createInterface({
    input: fs.createReadStream(filename, {
      enconding: 'utf8'
    }),
    output: null,
    terminal: false //这个参数很重要
  });

  rl.on('line', function(line) {
    if (line) {
      logsArr.push(line.toString());
    }
  }).on('close', function() {
    for (var i = 0; i < logsArr.length; i++) {
      console.log('历史内容（不会发送）: ' + logsArr[i]);
    //generateLog(logsArr[i])
    }
    listenLogs(filename);
  });
}
function generateLog(str) {
  var regExp = /(\[.+?\])/g; //(\\[.+?\\])
  var res = str.match(regExp);
  console.log(res);
  for (i = 0; i < res.length; i++) {
    res[i] = res[i].replace('[', '').replace(']', ''); //发送历史日志
  }
}
var listenLogs = function(filePath) {
  console.log('日志监听中...');
  var fileOPFlag = "a+";
  fs.open(filePath, fileOPFlag, function(error, fd) {
    var buffer;
    var remainder = null;
    fs.watchFile(filePath, {
      persistent: true,
      interval: 1000
    }, function(curr, prev) {
      console.log(curr);
      if (curr.mtime > prev.mtime) {
        //文件内容有变化，那么通知相应的进程可以执行相关操作。例如读物文件写入数据库等
        buffer = new Buffer(curr.size - prev.size);
        fs.read(fd, buffer, 0, (curr.size - prev.size), prev.size, function(err, bytesRead, buffer) {
          generateTxt(buffer.toString())
        });
      } else {
        console.log('文件读取错误');
      }
    });

    function generateTxt(content) { // 处理新增内容的地方
      //这里是处理新增股票信息的地方

      //主题subject和内容content 写入到config.js 中 增加用户名列表mails_to array，
      //使用同步模式，保证邮件不同时发送
      let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      //mail.sendMyMail(config.mail_to, '这是主题', '兄弟，这是内容，你要写写啥鸡吧东西');
      //需要改循环，

      let size = _.size(config.mails_to)
      console.log('mails_to:', config.mails_to)
      let loop = async function() {
        let i = 0
        while (i < size) {
          let mail_to = config.mails_to[i]
          console.log('mail to:', mail_to)
          //mail.sendMyMail(mail_to, config.subject, config.content);

          mail.sendMyMail(mail_to, config.subject, content);
          await sleep(1000)
          i++
        }
      }

      loop()

      /*
      var temp = str.split('\r\n');
      for (var s in temp) {
        console.log(temp[s]);
      }*/

    }
  });
}
function getNewLog(path) {
  console.log('做一些解析操作');
}
init();
