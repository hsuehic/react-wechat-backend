/**
 * @description 联系人操作对象模型
 * @File   : contact.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 17:38:31
 */

const BaseModel = require('./base');
const ContactService = require('../services/contact');

class ContactModel extends BaseModel {
  constructor(ctx) {
    super(ctx);
    const {db} = ctx.mongo;
    this.contactService = new ContactService(db);
  }

  /**
   * 创建联系人
   * @param {string} from 联系人
   * @param {string} to 目标
   */
  async createContact(from, to) {
    // 联系人ID
    const cid = from < to ? `${from}-${to}` : `${to}-${from}`;
    const doc = {
      cid,
      from,
      to
    };
    const result = await this.contactService.insert(doc);
    return result.toArray();
  }
}

module.exports = ContactModel;
