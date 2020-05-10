const jwt = require('jsonwebtoken')

// 解析token的中间件
module.exports = ({app}) => {
  return async function verify(ctx, next) {
    if(!ctx.request.header.authorization){
      ctx.body = {
        code: -1,
        message: '用户没有登录'
      }
      return
    }

    const token = ctx.request.header.authorization.replace('Bearer ', '')

    try {
      const ret = await jwt.verify(token, app.config.jwt.secret)
      console.log('用户信息：', ret)
      ctx.state.email = ret.email
      ctx.state.userid = ret._id
      await next()
    } catch (error) {
      if(error.name === 'TokenExpiredError'){
        ctx.body = {
          code: -666,
          message: '登录过期了'
        }
      }else {
        ctx.body = {
          code: -1,
          message: '用户信息错误'
        }
      }
    }
  }
}