var mail = require('./common/mail');
var config = require('./config');
var _ = require('lodash');

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
    mail.sendMyMail(mail_to, config.subject, config.content);
    await sleep(1000)
    i++
  }
}

loop()
