/**
 * @description: 消息对象
 * @File   : message.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 14:24:15
 */

const BaseModel = require('./base');
const MessageService = require('../services/message');

class MessageModel extends BaseModel {
  constructor(ctx) {
    super(ctx);
    const {db} = ctx.mongo;
    this.messageService = new MessageService(db);
  }

  /**
   * 获取对话信息
   * @param {string} from 说话方
   * @param {string} to 目标方
   */
  async getConversation(from, to) {
    // 对话id
    const cid = from < to ? `${from}-${to}` : `${to}-${from}`;
    const query = {
      cid
    };
    const result = await this.messageService.find(query);
    return result.toArray();
  }

  /**
   * 获取对话列表
   * @param {string} from 说话方
   * @param {string} to 接收方
   */
  async getConversations(from, to) {
    // 对话id
    const cid = from < to ? `${from}-${to}` : `${to}-${from}`;
    const query = {
      cid
    };
    const result = await this.messageService.find(query);
    return result.toArray();
  }
}

module.exports = MessageModel;
