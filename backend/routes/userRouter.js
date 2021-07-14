const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')
const mq = require('../controllers/rabbitmq')


router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/refresh_token', userController.refreshToken)
router.get('/info',auth, userController.getUser)
router.get('/users', userController.getAllUser)


// mq.consume('user','created','created_user', (msg) => {
//     console.log(JSON.parse(msg.content));
// })
// mq.consume('user','delete','delete_user', (msg) => {
//     console.log(JSON.parse(msg.content));
// })

module.exports = router