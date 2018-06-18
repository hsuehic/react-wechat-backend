const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const crypto = require('../utils/crypto');
const configs = require('../configs');

const { encryptUsingMd5 } = crypto;

router.prefix('/api');

router.all('/login', async(ctx, next) => {
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
    const userToken = { phone };
    const { secret } = configs;
    const token = jwt.sign(userToken, secret, {expiresIn: '1h'});

    ctx.body = {
      code: 0,
      message: 'success',
      data: {
        token
      }
    };
  }
});

router.all('/reg', (ctx, next) => {
  ctx.body = {
    code: 0,
    message: 'success'
  };
});

router.all('/info', (ctx, next) => {
  ctx.body = {
    code: 0,
    message: '',
    data: ctx.state.user || {}
  };
});

module.exports = router;
