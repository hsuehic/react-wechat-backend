/**
 * 用户服务
 * @File   : user.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 15:53:39
 */

const BaseService = require('./base');

class UserService extends BaseService {
  constructor(db, collectionName = 'user') {
    super(db, collectionName);
  }
}

module.exports = UserService;
