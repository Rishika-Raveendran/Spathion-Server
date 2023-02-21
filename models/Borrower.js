const mongoose = require("mongoose");

const borrowerSchema = {
  personal_details: {
    fullName: String,
    email: String,
    nationality: String,
    designation: String,
    contactNumber: String,
    identityProof: String,
    addressProof: String,
  },

  company_details: {
    companyName: String,
    companyEmail: String,
    companyContactNumber: String,
    companyWebsite: String,
    companyAddress: String,
    certificateOfIncorporation: String,
    MOAAOA: String,
    auditReport: String,
    GST: String,
    director1: String,
    director2: String,
    director3: String,
  },
};

const Borrower = mongoose.model("Borrower", borrowerSchema, "borrowers");
module.exports = Borrower;
