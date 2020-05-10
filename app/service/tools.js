const Service = require('egg').Service
const nodemailer = require('nodemailer')

const userEmail = 'wangxiang_email@126.com'
const transporter =  nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'TKWWKYNTBPHCGGHW'
  }
})

class ToolsService extends Service{
  async sendEmail(email, subject, text, html){
    const mailOption = {
      from: userEmail,
      cc: userEmail, // 抄送，避免邮箱认为是垃圾邮件 小tips
      to: email,
      subject,
      text,
      html,
    }

    try {
      await transporter.sendMail(mailOption)
      return true
    } catch (error) {
      console.log('email error:', error)
      return false
    }
  }
}

module.exports = ToolsService