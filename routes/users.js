const router = require('koa-router')();

const configs = require('../configs');

router.prefix('/api');

router.all('/login', (ctx, next) => {
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      token: ''
    }
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
  }
});

module.exports = router;
