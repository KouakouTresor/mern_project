const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
   email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    default: "",
  },
  apartement: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  phone: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    required: true,
  }, 
});

exports.User = mongoose.model("user", userSchema); 