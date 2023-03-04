const jwt = require('jsonwebtoken')

const createToken = (user) => {
  console.log('ok')

  const token = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  )

  return token
}

module.exports = { createToken }
