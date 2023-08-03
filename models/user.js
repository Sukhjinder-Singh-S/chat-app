const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  contact: { type: Number, required: true },
  gender: { type: String, enum: ["male", "Male", "female", "Female"] },
  password :{type:String,required:true}
});

module.exports = mongoose.model("user", userSchema);
