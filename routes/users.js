var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users
router.get('/', async function (req, res, next) {
  try {
    let result = await userModel.find({ isDeleted: false }).populate('role');
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// GET user by ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({
      isDeleted: false,
      _id: id
    }).populate('role');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// POST create user
router.post('/', async function (req, res, next) {
  try {
    let newUser = new userModel(req.body);
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// POST enable user (Yêu cầu 2)
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });
    if (user) {
      user.status = true;
      await user.save();
      res.send(user);
    } else {
      res.status(404).send({ message: "Thong tin khong chinh xac" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// POST disable user (Yêu cầu 3)
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });
    if (user) {
      user.status = false;
      await user.save();
      res.send(user);
    } else {
      res.status(404).send({ message: "Thong tin khong chinh xac" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// PUT update user
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(id, req.body, {
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

// DELETE soft delete user
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(id, {
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
