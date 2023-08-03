require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { SENDMAIL } = require("../helper/nodemailer");
const {OTP} = require('../helper/otp')

//USER SIGNUP CONTROLLER
exports.userSignup = async (req, res) => {
  try {
    const { name, email, address, age, contact, gender, password } = req.body;
    const check = await User.exists({ email: email });
    if (check) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: `Please Try to login` });
    }
    const hashedPass = await bcrypt.hash(password, 12);
    const saveIntoDb = await User.create({
      name,
      email,
      address,
      age,
      contact,
      gender,
      password: hashedPass,
    });
    const mailType = 1;
    await SENDMAIL(saveIntoDb, mailType);
    res.status(StatusCodes.OK).json(saveIntoDb);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

//USER LOGIN CONTROLLER
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const check = await User.findOne({ email: email });
    if (!check) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Try to signup Please` });
    }
    const compare = await bcrypt.compare(password, check.password);
    if (!compare) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: `Password did not match,Try again` });
    }
    const token = jwt.sign(
      {
        userId: check._id.toString(),
        name: check.name,
        email: email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );
    res.status(StatusCodes.OK).json({
      message: `User login into account`,
      token: token,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

//UPDATE USER INFORMATION
exports.updateUser = async (req, res) => {
  try {
    const id = req.params._id;
    const check = await User.findById(id);
    if (!check) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `No user found` });
    }
    const payload = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      age: req.body.age,
      contact: req.body.contact,
      gender: req.body.gender,
    };
    if (req.body.name !== req.name) {
      req.name = req.body.name;
    }
    await User.findByIdAndUpdate(id, payload);
    res.status(StatusCodes.OK).json({
      message: `User update successfully with id ${id}`,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const check = await User.findOne({ email: req.body.email });
    if (!check) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Email is not registered` });
    }
    const mailType = 2;
    const otp = await OTP()
    await SENDMAIL(check, mailType, otp);
    res.status(StatusCodes.OK).json({ message: `Please check you're email` });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

