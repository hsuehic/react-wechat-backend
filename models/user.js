/**
 * 用户相关的操作模型
 * @File   : user.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 13:32:52
 */

const BaseModel = require('./base');
const UserService = require('../services/user');
const ContactService = require('../services/contact');
const MessageService = require('../services/message');

/**
 * 用户模型
 */
class UserModel extends BaseModel {
  /**
   * 构造函数
   * @param {Koa.Application} ctx 上下文对象
   */
  constructor(ctx) {
    super(ctx);
    const { db } = ctx.mongo;
    this.userService = new UserService(db);
    this.contactService = new ContactService(db);
    this.messageService = new MessageService(db);
  }

  /**
   * 获取联系人列表
   */
  async getContactList() {
    const { contactService } = this;
    const { phone } = this.user;
    const query = {
      ower: phone
    };
    const result = await contactService.find(query);
    return result.toArray();
  }

  /**
   * 获取消息列表
   */
  async getMessageList() {
    const { messageService, user } = this;
    const { phone } = user;
    const query = {
      to: phone
    };
    const result = await messageService.find(query);
    return result.toArray();
  }
}

module.exports = UserModel;
