const router =  require('express').Router()
const categoryController = require('..//controllers/catController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const mq = require('../controllers/rabbitmq')


router.route('/category')
    .get(categoryController.getCategories)
    .post( categoryController.createCategory)

router.route('/category/:id')
    .delete( categoryController.deleteCategory)
    .put( categoryController.updateCategory)

    // mq.consume('cat','get','get_cat', (msg) => {
    //     console.log(JSON.parse(msg.content));
    // })
module.exports = router  