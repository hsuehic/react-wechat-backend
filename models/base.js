/**
 * 对象模型基类
 * @File   : base.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 15:55:31
 */

const configs = require('../configs');

class BaseModel {
  constructor(ctx, user) {
    this.context = ctx;
    this.user = user || ctx.state.user;
    const { mongo } = ctx;
    this.db = mongo.db(configs.db);
  }
}

module.exports = BaseModel;
