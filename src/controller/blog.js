const {exec,escape} = require('../db/mysql')

const {formatDate,formatDateTime} = require('../utils/utils')
var {SuccessModel,ErrorModel} = require('../model/resModel')


  //获取首页及分页博客内容数据
const getList = (pageSize, targetPage) => {
  let from = (targetPage - 1)*pageSize
  let to = pageSize
  let sql = `select article_id,article_picture, user_nickname, article_title, article_abstract, article_date, label_name, b.\`label_id\` FROM blogs b INNER JOIN users u ON b.\`user_id\` = u.\`user_id\` INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` WHERE b.state = 1 order by  article_date desc limit ${from},${to} ; select count(1) AS count from blogs where state=1`
  //返回 promise
  return exec(sql).then(result => {
    let data = result
    
    return new SuccessModel(data)
  })
}




 //获取博客内容详情数据
const getDetail = (id) => {
  let sql = `select article_id, user_nickname, article_abstract,article_title, article_content,article_date, label_name, b.\`label_id\` FROM blogs b INNER JOIN users u ON b.\`user_id\` = u.\`user_id\` INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` WHERE b.article_id = ${id} `

  return exec(sql).then(rows => {
    return new SuccessModel(rows[0])
  })
}
 //新建博客
const newBlog = (blogData = {}) => {
  // blogData是一个博客对象。包含title content author createtime属性
  const title = escape(blogData.title)
  const content = escape(blogData.content)
  //const createtime = Date.now()
  //const tag = escape(blogData.tag)
  const createtime = escape(formatDate(Date.now()))
  const label_id = escape(blogData.tag)
  const abstract = escape(blogData.abstract)
  const picture = escape(blogData.picture)
  

  const sql = `insert into blogs (article_title, article_content, article_date, label_id, article_abstract, article_picture) values 
              (${title}, ${content}, ${createtime}, ${label_id}, ${abstract}, ${picture})`

             
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
}
  //更新博客
const updateBlog = (blogData = {}) => {
   // blogData是一个博客对象。包含title content 属性
   //id 就是要更新的博客的id
   
   const title = escape(blogData.title)
   const content = escape(blogData.content)
   const abstract = escape(blogData.abstract)
   const label_id = escape(blogData.label_id)

   //const tag = escape(blogData.tag)
   const id = blogData.id
  
   const sql = `update blogs set article_title=${title}, article_content=${content}, article_abstract = ${abstract} , label_id=${label_id} where article_id=${id}`
   return exec(sql).then(updateData => {
     if (updateData.affectedRows > 0) {
       return new SuccessModel('修改成功')
     }
     return new ErrorModel('修改失败')
   })
}

  //删除博客(修改状态)
const delBlog = (idList) => {
  //id就是要删除博客的id
  let sql = ''
  idList.forEach(element => {
    sql += `update blogs set state=0 where article_id=${element}; `
  })
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
    let sql = `SELECT article_id, article_title, article_date, label_name From blogs  b INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` where label_name = '${labelName}' and state = 1 order by  article_date desc limit ${from},${to}; SElECT count(1) counts from blogs  b INNER JOIN label l ON b.\`label_id\` = l.\`label_id\` where label_name = '${labelName}' and state = 1`
    return exec(sql).then(result => {
      return new SuccessModel(result)
    })
  }

  //获取分类的个数
  const getLabelCount = () => {
    let sql = `select count(1) counts from label `

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
    let sql = `insert into label(label_name) value ('${tagName}')`
    return exec(sql).then(result => {
      return new SuccessModel(result)
    })
  }


  //获取最新5条评论
  const newComment = (dataInfo) => {
    let to = dataInfo.size
    let from = (dataInfo.currentPage - 1)* dataInfo.size

    let sql = `SELECT c.\`id\`, c.\`commentDate\`, c.\`commentContent\`, u.\`user_nickname\` toName, f.\`user_nickname\` fromName, b.\`article_id\`, b.\`article_title\` FROM comment_record c INNER JOIN users u ON c.\`toId\` = u.\`user_id\` INNER JOIN users f ON c.\`fromId\` = f.\`user_id\` INNER JOIN blogs b ON c.\`articleId\` = b.\`article_id\` order by  commentDate desc limit ${from},${to}; SELECT count(1) counts from comment_record;`

    return exec(sql).then(result => {
      return new SuccessModel(result)
    })

  }

  //获取最新5条留言
  const newMessage = (dataInfo) => {
    let to = dataInfo.size
    let from = (dataInfo.currentPage - 1)* dataInfo.size

    let sql = `SELECT c.\`id\`, c.\`commentDate\`, c.\`commentContent\`,  f.\`user_nickname\` fromName FROM leave_messages c INNER JOIN users f ON c.\`fromId\` = f.\`user_id\`  order by  commentDate desc limit ${from},${to}; SELECT count(1) counts from leave_messages`

    return exec(sql).then(result => {
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
  getDateBlog,
  newMessage,
  newComment,
  getLabelCount
}