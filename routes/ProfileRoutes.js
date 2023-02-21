const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
// const { app, conn } = require("../index.js");
const multer = require("multer");

const Lender = require("../models/Lender");
const Borrower = require("../models/Borrower");
const { GridFsStorage } = require("multer-gridfs-storage");

const conn = mongoose.createConnection(
  "mongodb+srv://spathion:spathion@cluster0.e00qjcz.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Spathion",
  }
);

//gridFS API
// -----------------------------------------------------------------------------------------------------------------
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "documents",
  });
});
const storage = new GridFsStorage({
  url: "mongodb+srv://spathion:spathion@cluster0.e00qjcz.mongodb.net/?retryWrites=true&w=majority",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "documents",
      };
      resolve(fileInfo);
    });
  },
});


const upload = multer({
  storage: storage,
});

//Adding a new lender profile
router.route("/lender").post((req, res) => {
  const newParticipant = new Lender({
    fullName: req.body.fullName,
    email: req.body.email,
    nationality: req.body.nationality,
    identityProof: req.body.identityProof,
  });

  newParticipant
    .save(newParticipant)
    .then(() => res.json({ msg: "Successful" }))
    .catch((err) => console.log(err));
});

//Adding a new borrower profile
router.route("/borrower").post(upload.array("documents", 9), (req, res) => {
  files = req.files;
  const {
    fullName,
    email,
    nationality,
    designation,
    contactNumber,
    companyName,
    companyEmail,
    companyContactNumber,
    companyWebsite,
    companyAddress,
  } = req.body;

  const document = {
    fullName,
    email,
    nationality,
    designation,
    contactNumber,
    companyName,
    companyEmail,
    companyContactNumber,
    companyWebsite,
    companyAddress,
    files,
  };
  // Save the data to your database (MongoDB in this case)
  conn.db
    .collection("borrowers")
    .insertOne(document)
    .then((result) => {
      res.send({ message: "Files and text fields uploaded successfully" });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error uploading files and text fields" });
    });

  
});

module.exports = router;
