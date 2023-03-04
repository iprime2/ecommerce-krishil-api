const Product = require('../models/Product')

const create = async (req, res) => {
  const newProduct = new Product(req.body)

  try {
    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
}

const get = async (req, res) => {
  const id = req.params.id
  try {
    const product = await Product.findById({ _id: id })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
}

const getAll = async (req, res) => {
  const qNew = req.query.new
  const qCategory = req.query.category
  const qType = req.query.type
  const qSort = req.query.sort
  const qMaxPrice = req.query.maxPrice

  console.log(req.query)
  try {
    let products

    if (qType) {
      if (qType === 'featured') {
        products = await Product.aggregate([{ $match: { isFeatured: true } }])
      } else if (qType === 'trending') {
        products = await Product.aggregate([{ $match: { isTrending: true } }])
      }
    } else if (qNew) {
      products = await Product.find().sort({ _id: -1 }).limit(1)
    } else if (qCategory === 'men' || qCategory === 'women') {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      })
    } else if (qSort) {
      products = await Product.find().sort({ price: qSort })
    } else if (qMaxPrice) {
      products = await Product.find({ price: { $lt: qMaxPrice } })
    } else {
      products = await Product.find()
    }

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
}

const update = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete()
    res.status(200).json('Deleted product with id: ' + req.params.id)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = {
  create,
  get,
  getAll,
  update,
  deleteProduct,
}
