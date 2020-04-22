
const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = 'hi, egg 测试'
  }
}

module.exports = HomeController
