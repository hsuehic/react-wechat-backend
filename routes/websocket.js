/**
 * websocket 相关的路由
 * @File   : websocket.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-18 13:49:58
 */

const router = require('koa-router');
const UserModel = require('../models/user');

const websocket = router();
const sockets = new Map();

websocket.get('/*', async(ctx, next) => {
  const { user } = ctx.state;
  // 已经登录通过难
  if (user) {
    const { phone } = user;
    sockets.add(phone, ctx.websocket);
    await sendInitialData(ctx);
    ctx.websocket.on('message', message => {
      const msg = JSON.parse(message);
      const { type } = msg;
      switch (type) {
        case 'candidate':
          sendCandidate(msg);
          break;
        default:
          break;
      }
    });
    ctx.websocket.on('close', () => {
      sockets.delete(phone);
    });
  } else {
    // 未登录的情况直接关闭socket链接
    ctx.websocket.close();
  }
  await next();
});

/**
 * 发送视频请求
 * @param { object } user 发送的用户
 * @param {object} msg 请求信息
 */
const sendCandidate = (user, msg) => {
  const { phone, candidate } = msg;
  const targetSocket = sockets.get(phone);
  if (targetSocket) {
    targetSocket.send(JSON.stringify({
      user,
      candidate
    }));
  }
};

/**
 * 发送初始化数据
 * @param {Application} ctx 上下文对象
 */
const sendInitialData = async ctx => {
  const userModel = new UserModel(ctx);
  const messages = await userModel.getMessageList();
  ctx.websocket.send(JSON.stringify({
    type: 'wechat/save',
    payload: {
      messages
    }
  }));
  const contacts = await userModel.getContactList();
  ctx.websocket.send(JSON.stringify({
    type: 'wechat/contacts',
    payload: {
      contacts
    }
  }));
};

module.exports = websocket;
