/**
 * 联系人服务
 * @File   : contact.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 15:50:02
 */

const BaseService = require('./base');

class ContactService extends BaseService {
  constructor(db, collectionName = 'contact') {
    super(db, collectionName);
  }
}

module.exports = ContactService;
