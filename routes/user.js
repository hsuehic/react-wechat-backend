const router = require('koa-router')();
const userController = require('../controllers/user');

router.prefix('/api');

// 用户登录
router.all('/login', userController.login);

// 用户注册
router.all('/reg', userController.register);

// 获取用户信息
router.all('/info', userController.info);

module.exports = router;
