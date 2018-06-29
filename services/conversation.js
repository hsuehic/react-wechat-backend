/**
 * 对话处理
 * @File   : conversation.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 14:27:08
 */

const BaseService = require('./base');

class ConversationService extends BaseService {
  constructor(db, collectionName = 'conversation') {
    super(db, collectionName);
  }
}

module.exports = ConversationService;
