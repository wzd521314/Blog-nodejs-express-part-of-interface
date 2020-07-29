const {exec,escape} = require('../db/mysql')

const {formatDate,formatDateTime} = require('../utils/utils')
var {SuccessModel,ErrorModel} = require('../model/resModel')


  //获取首页及分页博客内容数据
const getList = (pageSize, targetPage) => {
  let from = (targetPage - 1)*pageSize
  let to = pageSize
  let sql = `select article_id, user_nickname, article_title, article_content,article_date, label_name FROM blogs b INNER JOIN users u ON b.\`user_id\` = u.\`user_id\` INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` WHERE b.state = 1 order by  article_date desc limit ${from},${to} ; select count(1) AS count from blogs where state=1`
  console.log(sql)
  //返回 promise
  return exec(sql).then(result => {
    let data = result
    
    return new SuccessModel(data)
  })
}




 //获取博客内容详情数据
const getDetail = (id) => {
  let sql = `select article_id, user_nickname, article_title, article_content,article_date, label_name FROM blogs b INNER JOIN users u ON b.\`user_id\` = u.\`user_id\` INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` WHERE b.article_id = ${id} `

  return exec(sql).then(rows => {
    return new SuccessModel(rows[0])
  })
}
 //新建博客
const newBlog = (blogData = {}) => {
  // blogData是一个博客对象。包含title content author createtime属性
  console.log(blogData)
  const title = escape(blogData.title)
  const content = escape(blogData.content)
  //const createtime = Date.now()
  //const tag = escape(blogData.tag)
  const createtime = escape(formatDateTime(Date.now()))
  const label_id = escape(blogData.tag)

  const sql = `insert into blogs (article_title, article_content, article_date, label_id) values 
              (${title}, ${content}, ${createtime}, ${label_id})`
  console.log(sql)
  return exec(sql).then(insertData => {
    console.log(insertData)
    return {
      id: insertData.insertId
    }
  })
}
  //更新博客
const updateBlog = (blogData = {}) => {
   // blogData是一个博客对象。包含title content 属性
   //id 就是要更新的博客的id
   console.log(blogData)
   const title = escape(blogData.title)
   const content = escape(blogData.content)
   //const tag = escape(blogData.tag)
   const id = blogData.id

   const sql = `update blogs set article_title=${title}, article_content=${content}, label_id=1 where article_id=${id}`
   console.log(sql)
   return exec(sql).then(updateData => {
     console.log(updateData)
     if (updateData.affectedRows > 0) {
       return new SuccessModel('修改成功')
     }
     return new ErrorModel('修改失败')
   })
}

  //删除博客(修改状态)
const delBlog = (idList) => {
  //id就是要删除博客的id
  console.log(idList)
  let sql = ''
  idList.forEach(element => {
    sql += `update blogs set state=0 where article_id=${element}; `
  })
  console.log(sql)
  return exec(sql).then(deleteData => {

    if(deleteData instanceof Array) {
      let allDel = true
      deleteData.forEach(element => {
        if(element.affectedRows > 0){
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

  //获取标签List
  const getTags = () => {
    let sql='select * from label'

    return exec(sql).then(tagList => {
      return new SuccessModel(tagList)
    })

  }
  //获取指定分类的所有博客内容
  const getLabelBlog = ({targetPage, pageSize, labelName}) => {
    let from = (targetPage - 1)*pageSize
    let to = pageSize
    let sql = `SELECT article_id, article_title, article_date, label_name From blogs  b INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` where label_name = '${labelName}' and state = 1 order by  article_date desc limit ${from},${to};`
    return exec(sql).then(result => {
      return new SuccessModel(result)
    })
  }

  //获取指定月份的所有博客内容
  const getDateBlog = ({targetPage, pageSize, year, month}) => {
    let from = (targetPage - 1)*pageSize
    let to = pageSize
    let sql = `SELECT article_id, article_title, article_date, label_name From blogs  b INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` where DATE_FORMAT(article_date,'%Y')=${year}  and DATE_FORMAT(article_date,'%m') = ${month} order by  article_date desc limit ${from},${to};`
    return exec(sql).then(result => {
      console.log('1');
      
      console.log(result)
      return new SuccessModel(result)
    })
  }

  //获取博文对应标签的个数
  const getTagCount = () => {
    let sql = 'SELECT count(l.`label_id`) label_count, l.`label_id`, label_name From blogs b INNER JOIN label l ON b.`label_id` = l.`label_id` GROUP BY label_name;';
    return exec(sql).then(result => {
      return new SuccessModel(result)
    })
  }

  //获取月份对应标签的个数
  const getDateCount = () => {
    let sql = ` SELECT count(article_title) dateCount, DATE_FORMAT(article_date,'%Y') years,  DATE_FORMAT(article_date,'%m') months  FROM blogs where state=1 GROUP BY years, months order by years DESC, months DESC; `
    return exec(sql).then(result => {
      return new SuccessModel(result)
    })
  }

  //添加分类
  const newTag = (tagName) => {
    console.log(tagName)
    let sql = `insert into label(label_name) value ('${tagName}')`
    return exec(sql).then(result => {
      console.log(result)
      return new SuccessModel(result)
    })
  }



module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
  getTags,
  newTag,
  getTagCount,
  getLabelBlog,
  getDateCount,
  getDateBlog
}