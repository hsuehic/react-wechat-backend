/**
 * @File   : user.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-18 15:29:20
 */

const jwt = require('jsonwebtoken');
const pinyin = require('pinyin');
const crypto = require('../utils/crypto');
const configs = require('../configs');

const { db: dbName } = configs;
const { encryptUsingMd5 } = crypto;

const register = async(ctx, next) => {
  const { nick, thumb, userName, password, region, email, phone } = ctx.request.body;
  let message;
  if (!nick) {
    message = '请填写昵称';
  } else if (!userName) {
    message = '请输入用户名';
  } else if (!password) {
    message = '请输入密码';
  } else if (!email) {
    message = '请输入Email';
  } else if (!phone) {
    message = '请输入手机号码';
  }
  if (message) {
    ctx.body = {
      code: 100003,
      message
    };
  } else {
    const group = pinyin(nick, { style: pinyin.STYLE_FIRST_LETTER })[0][0].toUpperCase().substr(0, 1);

    const user = { nick, thumb, userName, password: encryptUsingMd5(password), region, email, phone, group, contacts: [] };
    const collection = ctx.mongo.db(dbName).collection('user');
    const result = await collection.insertOne(user);
    if (result.insertedCount > 0) {
      ctx.body = {
        code: 0,
        message: ''
      };
    } else {
      ctx.body = {
        code: 100004,
        message: '手机号已注册'
      };
    }
  }
  next();
};

const login = async(ctx, next) => {
  const collection = ctx.mongo.db('wechat').collection('user');
  const { phone, password } = ctx.request.body;
  const user = await collection.findOne({ phone });
  if (!user) {
    ctx.body = {
      code: 100001,
      message: '手机号没有注册'
    };
  } else if (user.password != encryptUsingMd5(password)) {
    ctx.body = {
      code: 100002,
      message: '密码错误'
    };
  } else {
    const { nick } = user;
    const userToken = { phone, nick };
    const { secret } = configs;
    const token = jwt.sign(userToken, secret);

    let info = { ...user };
    delete info.password;
    ctx.body = {
      code: 0,
      message: 'success',
      data: {
        info,
        token
      }
    };
  }
  next();
};

const info = async(ctx, next) => {
  const { user } = ctx.state;
  const { phone } = user;
  const info = await ctx.mongo.db('wechat').collection('user').findOne({ phone }, {
    projection: {
      password: 0,
      contacts: 0
    }
  });
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      info
    }
  };
  next();
};

module.exports = {
  register,
  login,
  info
};
