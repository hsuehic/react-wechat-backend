/**
 * 对象模型基类
 * @File   : base.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 15:55:31
 */

class BaseModel {
  constructor(ctx) {
    this.context = ctx;
    this.user = ctx.state.user;
  }
}

module.exports = BaseModel;
