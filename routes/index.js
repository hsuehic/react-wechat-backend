const router = require('koa-router')();

router.get('/', async (ctx, next) => {
  const session = ctx.session;
  session.count = session.count || 0;
  session.count++;
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    count: session.count
  });
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string';
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  };
});

module.exports = router;
