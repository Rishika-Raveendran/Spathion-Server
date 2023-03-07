const mongoose = require("mongoose");

const invoiceSchema = {
  
    companyName: String,
    companyEmail: String,
    companyContactNumber: String,
    companyWebsite: String,
    companyAddress: String,
    supplierInvoice:String,
    invoiceDate:String,
    invoiceDue:String,
    invoiceAmount:String,
    advanceAmount:String,
    loanRequired:String,
    invoiceVerified:Boolean,
    arpaVerified: Boolean,
    files:Array

  
};

const Invoice = mongoose.model("Invoice", invoiceSchema, "invoices");
module.exports = Invoice;
