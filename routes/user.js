const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/isAuth");
const userController = require("../controller/user");

router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.patch("/updateUser/:_id", isAuth, userController.updateUser);
router.post('/forgotPassword',userController.forgotPassword)

module.exports = router;
