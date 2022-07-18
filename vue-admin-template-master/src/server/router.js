let express = require('express')
let router = express.Router()
let user = require('./API/user')

router.get('/weibo1', user.get) // 获取用户信息
router.delete('/weibo1/?', user.delete) // 删除用户信息

module.exports = router // 导出路由模块

