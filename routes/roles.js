var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles
router.get('/', async function (req, res, next) {
  try {
    let result = await roleModel.find({ isDeleted: false });
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// GET role by ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOne({
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

// POST create role
router.post('/', async function (req, res, next) {
  try {
    let newRole = new roleModel(req.body);
    await newRole.save();
    res.send(newRole);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// PUT update role
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, {
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

// DELETE soft delete role
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findByIdAndUpdate(id, {
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

// GET all users by role ID  (Yêu cầu 4: /roles/:id/users)
router.get('/:id/users', async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleModel.findOne({ _id: id, isDeleted: false });
    if (!role) {
      return res.status(404).send({ message: "ROLE NOT FOUND" });
    }
    let users = await userModel.find({
      role: id,
      isDeleted: false
    }).populate('role');
    res.send(users);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
