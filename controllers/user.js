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

// 注册
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
    const db = ctx.mongo.db(dbName);
    const defaultContacts = ['18958067917', '18958067916'];
    const user = { nick, thumb, userName, password: encryptUsingMd5(password), region, email, phone, group, contacts: defaultContacts };
    const collection = db.collection('user');
    const result = await collection.insertOne(user);
    if (result.insertedCount > 0) {
      ctx.body = {
        code: 0,
        message: ''
      };

      collection.updateMany({
        phone: {
          $in: defaultContacts
        }
      }, {
        $addToSet: {
          contacts: phone
        }
      });

      // 添加对话记录
      const c = db.collection('conversation');
      await c.insertOne({
        phone,
        conversation: {
          '18958067917': {
            timestamp: new Date().getTime(),
            newCount: 0,
            items: []
          },
          '18958067916': {
            timestamp: new Date().getTime(),
            newCount: 0,
            items: []
          }
        }
      });
    } else {
      ctx.body = {
        code: 100004,
        message: '手机号已注册'
      };
    }
  }
  next();
};

// 登录， 返回token和用户信息
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

// 查询用户信息
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

// 搜索联系人
const search = async(ctx, next) => {
  const { user } = ctx.state;
  const { phone } = user;
  const { keyword } = ctx.request.body;
  const reg = { $regex: `.*${keyword}.*`, $options: 'i', $nin: [phone] };
  const query = { phone: reg };
  const collection = ctx.mongo.db('wechat').collection('user');
  const options = {
    projection: {
      phone: 1,
      nick: 1,
      thumb: 1,
      group: 1,
      userName: 1,
      region: 1
    }
  };
  const result = collection.find(query, options);
  const contacts = await result.toArray();
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      searchResult: contacts
    }
  };
  next();
};

// 添加到通讯录
const addContact = async(ctx, next) => {
  const { user } = ctx.state;
  const { phone } = user;
  const { phone: contact } = ctx.request.body;
  const operations = [
    { updateOne: { filter: { phone }, update: { $addToSet: { contacts: contact } } } },
    { updateOne: { filter: { phone: contact }, update: { $addToSet: { contacts: phone } } } }
  ];
  const collection = ctx.mongo.db('wechat').collection('user');
  const result = await collection.bulkWrite(operations);
  const { modifiedCount } = result;
  const code = modifiedCount > 0 ? 0 : 1;
  ctx.body = {
    code,
    message: 'success',
    data: {}
  };
  next();
};

module.exports = {
  register,
  login,
  info,
  search,
  addContact
};
