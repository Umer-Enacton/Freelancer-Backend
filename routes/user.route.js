const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  AddUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.post("/user", AddUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
