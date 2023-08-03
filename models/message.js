const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    recUserId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
