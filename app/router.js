/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const jwt = app.middleware.jwt({app})
  const { router, controller } = app
  router.get('/', controller.home.index)
  // 验证码
  router.get('/captcha', controller.utils.captcha)
  router.get('/sendcode', controller.utils.sendcode)
  router.post('/uploadfile', jwt, controller.utils.uploadfile)

  router.group({name: 'user', prefix: '/user'}, router => {
    const {info, login, register, verify} = controller.user
    router.post('/register', register)
    router.post('/login', login)
    router.get('/info', jwt, info)
    router.get('/verify', verify)
  })
}
