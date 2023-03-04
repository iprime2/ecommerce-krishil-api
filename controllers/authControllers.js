const User = require('../models/User')
const CryptoJS = require('crypto-js')
const { createToken } = require('../utils/createJwtToken')

const register = async (req, res) => {
  const password = req.body.password
  const encryptPassword = CryptoJS.AES.encrypt(
    password,
    process.env.PASS_SEC
  ).toString()
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: encryptPassword,
  })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json(err)
  }
}

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      res.status(401).json('invalid username')
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    )
    const password = hashedPassword.toString(CryptoJS.enc.Utf8)

    if (password !== req.body.password) {
      res.status(401).json('Password is incorrect')
    }

    const accessToken = createToken(user)

    res.status(200).json({ user, accessToken })
  } catch (err) {
    res.status(500).json(err)
  }
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })

  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

module.exports = {
  register,
  login,
  logout,
}
