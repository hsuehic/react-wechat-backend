/**
 * 消息处理服务
 * @File   : message.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 14:27:08
 */

const BaseService = require('./base');

class MessageService extends BaseService {
  constructor(db, collectionName = 'message') {
    super(db, collectionName);
  }
}

module.exports = MessageService;
