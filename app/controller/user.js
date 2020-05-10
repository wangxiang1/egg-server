const BaseController = require('./base')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const createRule = {
  email: {type: 'email'},
  name: {type: 'string'},
  password: {type: 'string'},
  captcha: {type: 'string'},
}

const HashSalt = ':wangxiang@#$%%!123'

class UserController extends BaseController{
  async login(){
    const {ctx, app} = this
    const {captcha, email, password, emailcode} = ctx.request.body

    if(captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()){
      return this.error('验证码错误')
    }

    console.log(emailcode, ctx.session.emailcode );
    if(emailcode !== ctx.session.emailcode){
      return this.error('邮箱验证码错误')
    }

    const user = await ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt)
    })

    if(!user){
      return this.error('用户名密码错误')
    }

    // 用户信息加密成token
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: "1h"
    })

    this.success({token, email, name: user.name})
  }

  async register(){
    const {ctx} = this
    try {
      // 传递校验参数
      ctx.validate(createRule)

    } catch (e) {
      return this.error('参数检验失败', -1, e.errors)
    }

    // 获取数据
    const {email, password, name, captcha} = ctx.request.body

    if(captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()){
      return this.error('验证码错误')
    }

    // 邮箱是否重复
    if(await this.checkEmail(email)){
      this.error('邮箱重复')
    }else{
      const result = await this.ctx.model.User.create({
        email, 
        password: md5(password + HashSalt), 
        name
      })

      if(result._id){
        this.message('注册成功')
      }

    }
    // this.success({name: 'kkb'})
  }

  async checkEmail(email){
    const user = await this.ctx.model.User.findOne({email})
    return user
  }

  async verify(){
    // 校验用户名是否存在

  }

  async info(){
    const {ctx} = this
    // 需要从token里读数据
    const {email} = ctx.state
    const user = await this.checkEmail(email)
    this.success(user)
  }
}

module.exports = UserController
