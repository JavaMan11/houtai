let db = require('../db/index')

exports.get = (req, res) => {
    // console.log(req);
    var sql = 'select * from users'
    db.query(sql, [req.query.name, req.query.password], (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.delete = (req, res) => {
    // console.log(req);
    var sql = 'delete from users where id = ?'
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
    
}

