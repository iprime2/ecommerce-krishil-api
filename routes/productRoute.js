const router = require('express').Router()

const {
  create,
  get,
  getAll,
  update,
  deleteProduct,
  userStats,
} = require('../controllers/productController')

const { VerifyAdminAuthorization } = require('../utils/verifyToken')

router.get('/', getAll)
router.post('/', VerifyAdminAuthorization, create)
router.get('/:id', get)
router.put('/:id', VerifyAdminAuthorization, update)
router.delete('/:id', VerifyAdminAuthorization, deleteProduct)

module.exports = router
