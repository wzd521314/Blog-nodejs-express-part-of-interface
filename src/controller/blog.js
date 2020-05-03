const {exec,escape} = require('../db/mysql')
var {SuccessModel,ErrorModel} = require('../model/resModel')


  //获取首页及分页博客内容数据
const getList = (pageSize, targetPage) => {
  let from = (targetPage - 1)*pageSize
  let to = pageSize
  let sql = `select * from blogs where state=1 order by createtime desc limit ${from},${to}; select count(1) from blogs where state=1`
  
  //返回 promise
  return exec(sql).then(result => {
    let data = {}
    data.blogData = result[0]
    data.blogTotal = result[1][0]["count(1)"]
    
    return new SuccessModel(data)
  })
}




 //获取博客内容详情数据
const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then(rows => {
    return new SuccessModel(rows[0])
  })
}
 //新建博客
const newBlog = (blogData = {}) => {
  // blogData是一个博客对象。包含title content author createtime属性
  const title = escape(blogData.title)
  const content = escape(blogData.content)
  const tag = escape(blogData.tag)
  const createtime = Date.now()

  const sql = `insert into blogs (title, content, createtime, tag) values 
              (${title}, ${content}, ${createtime}, ${tag})`

  return exec(sql).then(insertData => {
    console.log(insertData)
    return {
      id: insertData.insertId
    }
  })
}
  //更新博客
const updateBlog = (id, blogData = {}) => {
   // blogData是一个博客对象。包含title content 属性
   //id 就是要更新的博客的id
   const title = blogData.title
   const content = blogData.content
   const tag = blogData.tag

   const sql = `update blogs set title='${title}', content='${content}', tag='${tag}' where id=${id}`

   return exec(sql).then(updateData => {
     console.log(updateData)
     if (updateData.affectedRows > 0) {
       return true
     }
     return false
   })
}

  //删除博客(修改状态)
const delBlog = (idList) => {
  //id就是要删除博客的id
  let sql = ''
  idList.forEach(element => {
    sql += `update blogs set state=0 where id=${element}; `
  })
  console.log(sql)
  
  return exec(sql).then(deleteData => {

    if(deleteData instanceof Array) {
      let allDel = true
      deleteData.forEach(element => {
        if(element.affectedRows > 0){
          console.log(element.affectedRows)
        }else {
          allDel = false
        }
      })
      return allDel
    }else {
      return deleteData.affectedRows > 0? true:false
    }

    
  })
}


 /**
  * 后台页面的分页接口
  */




module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
}