const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
// const { app, conn } = require("../index.js");
const multer = require("multer");

const Lender = require("../models/Lender");
const Borrower = require("../models/Borrower");
const Invoice = require("../models/Invoice");
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

// ------------------------------- Lender---------------------------------

//Adding a new lender profile
router.route("/lender").post((req, res) => {
  const newParticipant = new Lender({
    username: req.body.username,
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

//Getting all lender profiles
router.route("/lender").get((req, res) => {
  Lender.find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ---------------------------------------------Borrower-------------------------
//Adding a new borrower profile
router.route("/borrower").post(upload.array("documents", 9), (req, res) => {
  files = req.files;
  const {
    username,
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
    username,
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

//Saving invoice details
router.route("/invoice").post(upload.array("documents", 2), (req, res) => {
  files = req.files;
  const {
    username,
    companyName,
    companyEmail,
    companyContactNumber,
    companyWebsite,
    companyAddress,
    supplierInvoice,
    invoiceDate,
    invoiceDue,
    invoiceAmount,
    advanceAmount,
    loanRequired,
  } = req.body;
  invoiceVerified = false;
  arpaVerified = false;
  invoiceRejected = false;
  arpaRejected = false;
  const document = {
    username,
    companyName,
    companyEmail,
    companyContactNumber,
    companyWebsite,
    companyAddress,
    supplierInvoice,
    invoiceDate,
    invoiceDue,
    invoiceAmount,
    advanceAmount,
    loanRequired,
    invoiceVerified,
    invoiceRejected,
    arpaVerified,
    arpaRejected,
    files,
  };
  // Save the data to your database (MongoDB in this case)
  conn.db
    .collection("invoices")
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

//Getting unverified and unrejected invoice
router.route("/invoice").get((req, res) => {
  Invoice.find({ invoiceVerified: false, invoiceRejected: false })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});
//Getting verified invoices
router.route("/invoice-approved").get((req, res) => {
  Invoice.find({ invoiceVerified: true })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Getting all unverified arpas
router.route("/arpa").get((req, res) => {
  Invoice.find({ arpaVerified: false, arpaRejected: false })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Approving and rejecting arpas and invoices
router.route("/verify").post((req, res) => {
  let invoiceId = req.body.invoiceId;
  let docType = req.body.docType;
  let status = req.body.status;
  console.log(invoiceId);
  if (docType === "invoiceVerified") {
    Invoice.updateOne(
      { _id: invoiceId },
      {
        $set: {
          invoiceVerified: status,
          invoiceRejected: !status,
        },
      },
      function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      }
    )
      .then(() => {
        res.json({ msg: "Successful" });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Invoice.updateOne(
      { _id: invoiceId },
      {
        $set: {
          arpaVerified: status,
          arpaRejected: !status,
        },
      },
      function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      }
    )
      .then(() => {
        res.json({ msg: "Successful" });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//Getting all borrower profiles
router.route("/borrower").get((req, res) => {
  Borrower.find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
