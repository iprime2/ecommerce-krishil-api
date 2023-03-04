const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const verifyToken = (req, res, next) => {
  const authHeaderToken = req.headers.token
  if (authHeaderToken) {
    const token = authHeaderToken.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json('Token is not valid')
      req.user = user
      next()
    })
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json('Your not authenticated')
  }
}

const VerifyTokenAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      res
        .status(StatusCodes.FORBIDDEN)
        .json('You are not authorized or forbidden')
    }
  })
}

const VerifyAdminAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      res.status(StatusCodes.FORBIDDEN).json('Your not authorized')
    }
  })
}

module.exports = {
  verifyToken,
  VerifyTokenAuthorization,
  VerifyAdminAuthorization,
}
