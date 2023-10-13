const express = require('express')
const router = express.Router()
const userController = require('./controllers/userControllers')
const accountController = require('./controllers/accountControllers')
const transactionController = require('./controllers/transactionControllers')
// const transactionControllers = require('./controllers/transactionControllers')

router.get('/', (req, res) => {
    return res.json({
        massage: "Hello World"
    })
})

router.post('/users', userController.registerUser)
router.get('/users', userController.getUser)
router.get('/users/:userId', userController.getUserId)

router.post('/accounts', accountController.registerAccount)
router.get('/accounts', accountController.getAccount)
router.get('/accounts/:accountId', accountController.getAccountId)

router.post('/transactions', transactionController.registerTransaction)
router.get('/transactions', transactionController.getTransaction)
router.get('/transactions/:transactionId', transactionController.getTransactionId);

module.exports = router