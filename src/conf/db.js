const env = process.env.NODE_ENV //环境变量

//配置
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'wzd15727657758',
    database: 'myblog',
    multipleStatements: true
  },
  REDIS_CONF = {
    port: 3306,
    host: '127.0.0.1'
  }

}
if (env === 'production') {
  MYSQL_CONF = {
    host: '112.124.21.52',
    user: 'root',
    password: 'Wzd15727657758',
    database: 'myblog',
    multipleStatements: true

  },
  REDIS_CONF = {
    port: 3306,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}