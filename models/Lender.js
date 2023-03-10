const mongoose = require("mongoose");

const lenderSchema = {
  username: String,
  fullName: String,
  email: String,
  nationality: String,
  identityProof: String,
};

const Lender = mongoose.model("Lender", lenderSchema, "lenders");
module.exports = Lender;
