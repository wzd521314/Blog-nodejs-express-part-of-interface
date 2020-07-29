var express = require('express')
var router = express.Router()
var {getList, getDetail, delBlog, updateBlog, newBlog, getTags, newTag, getTagCount, getLabelBlog, getDateCount, getDateBlog} =require('../controller/blog')
var {SuccessModel,ErrorModel} = require('../model/resModel')


//获取博客文章主页面接口
router.post('/blog', (req, res, next) => {
  getList(req.body.pageSize, req.body.targetPage).then(result => {
    res.send(result)

  })
})



//获取文章详情接口
router.get('/detail', (req, res, next) => {
  getDetail(req.query.id).then(result => {
    res.send(result)
  })
})

//删除博客接口(并非直接删除，而是修改状态值)
router.post('/delete', (req, res, next) => {
  console.log(req.body.id)
  delBlog(req.body.id).then(result => {
    if(result) {
      res.send(new SuccessModel('修改成功'))
    }else {
      res.send(new ErrorModel('修改失败'))
    }
  })

  
  
  
  // delBlog(2).then(result => {
  //   if(result){
  //     res.send('修改成功')
  //   }else{
  //     res.send('修改失败')
  //   }
  // })
})

//更新博客接口
router.post('/update', (req, res, next) => {
  const blogData = req.body
  updateBlog(blogData).then(result => {
    res.send(result)
  })
})

//新建博客接口
router.post('/newblog', (req, res, next) => {
  newBlog(req.body).then(result => {
    res.send(result)
  })
})

//获取标签列表接口
router.post('/tags', (req,res,next) => {
  getTags().then(result => {
    res.send(result)
  })
})

//添加分类接口
router.post('/newTag', (req, res, next) => {
  console.log(req.body.tagName)
  newTag(req.body.tagName).then(result => {
    res.send(result)
  })
})

//获取每个分类对应的博客数目
router.post('/tagCount', (req, res, next) => {
  getTagCount().then(result => {
    res.send(result)
  })
})

//获取每个月份对应的博客数目
router.post('/dateCount', (req, res, next) => {
  getDateCount().then(result => {
    res.send(result)
  })
})

//指定分类的博客内容接口
router.post('/labelBlog', (req, res, next) => {
  
  getLabelBlog(req.body).then(result => {
    res.send(result)
  })
})

//获取指定月份的博客内容
router.post('/dateBlog', (req, res, next) => {
  getDateBlog(req.body).then(result => {
    res.send(result)
  })
})


module.exports = router



