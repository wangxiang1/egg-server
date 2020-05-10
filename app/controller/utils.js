const svgCaptcha = require('svg-captcha')
const BaseController = require('./base')
const fse = require('fs-extra')

class UtilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3
    });
    this.ctx.session.captcha = captcha.text
    // console.log(captcha.text);
    this.ctx.response.type = "image/svg+xml"
    this.ctx.body = captcha.data
  }

  async sendcode() {
    const {ctx} = this
    const email = ctx.query.email
    let code = Math.random().toString().slice(2,6)
    console.log("邮箱："+ email + '验证码：' + code)
    ctx.session.emailcode = code

    const subject = 'Flare邮箱验证码'
    const text = ''
    const html = `<h2>邮箱验证码</h2><a href="http://localhost:3000/login">${code}</a>`
    const hasSend = await ctx.service.tools.sendEmail(email, subject, text, html)
    if (hasSend) {
      this.message("发送成功")
    }else{
      this.error("发送失败")
    }
  }

  async uploadfile() {
    console.log('ipload=============', );
    const {ctx} = this
    const {name} = ctx.request.body
    const [file] = ctx.request.files
    console.log(file.filepath, this.config.UPLOAD_DIR);
    await fse.move(file.filepath, this.config.UPLOAD_DIR+'/'+file.filename)
    this.success({
      url: `/public/${file.filename}`
    })
  }
}

module.exports = UtilController