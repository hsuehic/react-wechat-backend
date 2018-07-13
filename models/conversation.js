/**
 * @description: 对话对象模型
 * @File   : message.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 14:24:15
 */

const BaseModel = require('./base');
const ConversationService = require('../services/conversation');

class ConversationModel extends BaseModel {
  constructor(ctx) {
    super(ctx);
    this.conversationService = new ConversationService(this.db);
  }
  async update(filter, update, options) {
    const result = await this.conversationService.updateOne(filter, update, options);
    return result;
  }
}

module.exports = ConversationModel;
