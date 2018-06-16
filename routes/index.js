const router = require('koa-router')();

router.get('/', async(ctx, next) => {
  const session = ctx.session;
  session.count = session.count || 0;
  session.count++;
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    count: session.count
  });
});

router.get('/string', async(ctx, next) => {
  ctx.body = 'koa2 string';
});

router.get('/json', async(ctx, next) => {
  const user = await ctx.mongo.db('wechat').collection('user').find({ userName: 'hsuehic' }).toArray();
  ctx.body = user;
});

module.exports = router;
