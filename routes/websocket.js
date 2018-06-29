/**
 * websocket 相关的路由
 * @File   : websocket.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-18 13:49:58
 */

const router = require('koa-router');
const UserModel = require('../models/user');
const MessageModel = require('../models/message');

const websocket = router();
const sockets = new Map();

websocket.get('/wechat/:token', async(ctx, next) => {
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
          sendCandidate(ctx, user, msg);
          break;
        case 'message':
          sendMessage(ctx, user, msg);
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
 * @param {object} ctx 请求上下文
 * @param {object} user 发送的用户
 * @param {object} msg 请求信息
 */
const sendCandidate = (ctx, user, msg) => {
  const { payload } = msg;
  const { phone, candidate } = payload;
  const targetSocket = sockets.get(phone);
  if (targetSocket) {
    targetSocket.send(JSON.stringify({
      user,
      candidate
    }));
  } else {
    // 保存离线消息
    saveOfflineMessage(ctx, user, {
      type: 'message',
      payload: {
        phone: phone,
        message: 'video-chat-request'
      }
    });
  }
};

/**
 * 消息处理
 * @param {object} ctx, 请求上下文
 * @param {object} user 发送的用户
 * @param {string} msg 消息内容
 */
const sendMessage = (ctx, user, msg) => {
  const { payload } = msg;
  const { phone, message } = payload;
  const targetSocket = sockets.get(phone);
  if (targetSocket) {
    targetSocket.send({
      type: 'message',
      payload: {
        user,
        message
      }
    });
  } else { // 保存离线消息
    saveOfflineMessage(ctx, user, msg);
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

const saveOfflineMessage = async(ctx, user, msg) => {
  const now = new Date();
  const { payload } = msg;
  const { phone, message } = payload;
  const messageModel = new MessageModel(ctx);
  const selector = {
    to: phone
  };
  const document = {
    $set: {
      date: now,
      message
    },
    $inc: {
      count: 1
    }
  };
  const options = {
    insert: true,
    multi: false
  };
  messageModel.update(selector, document, options);
};

module.exports = websocket;
