var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');
const { default: slugify } = require('slugify');

/* GET products listing. */
router.get('/', async function(req, res, next) {
  try {
    // Lấy tất cả items chưa bị xóa, không truy vấn params
    let result = await productModel.find({ isDeleted: false });
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({
      isDeleted: false,
      _id: id
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function (req, res, next) {
  try {
    let data = req.body;
    if (data.title && !data.slug) {
      data.slug = slugify(data.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      });
    }
    let newProduct = new productModel(data);
    await newProduct.save();
    res.send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let data = req.body;
    if (data.title && !data.slug) {
      data.slug = slugify(data.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      });
    }
    let updatedItem = await productModel.findByIdAndUpdate(id, data, {
      new: true
    });
    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(id, {
      isDeleted: true
    }, {
      new: true
    });
    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
