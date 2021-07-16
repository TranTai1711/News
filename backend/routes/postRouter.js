const router =  require('express').Router()
const mq = require('../controllers/rabbitmq')
const postController = require('../controllers/postController')

router.route('/posts')
    .get(postController.getAllPost)
    .post(postController.createPosts)

// router.route('/postss')
//     .get(postController.getPosts)

router.route('/posts/:id')
    .get(postController.getPost)
    .delete(postController.deletePosts)
    .put(postController.updatePosts)

mq.consume('post','created','created_post', (msg) => {
    console.log(JSON.parse(msg.content));
})
mq.consume('post','delete','delete_post', (msg) => {
    console.log(JSON.parse(msg.content));
})

module.exports = router  
