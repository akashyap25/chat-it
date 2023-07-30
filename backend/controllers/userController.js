
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const dotenv = require("dotenv").config();

function createToken(_id) {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
}

async function signUp(req, res) {
  const { email, password, userName, displayPicture } = req.body;
  try {
    const user = await UserModel.signup(email, password, userName, displayPicture);
    const token = createToken(user._id);
    res.status(200).json({ id: user._id, displayPicture, token, email, password, userName });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password, userName } = req.body;
  try {
    const user = await UserModel.login(email, password, userName);
    const token = createToken(user._id);
    res.status(200).json({ id: user._id, displayPicture: user.displayPicture, token, email, password, userName });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteAccount(req, res) {
  const { id } = req.params;
  try {
    const user = await UserModel.findOneAndDelete({ _id: id });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function findUser(req, res) {
  const { userName } = req.params;
  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  signUp,
  login,
  deleteAccount,
  findUser,
};
