const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/ProfileRoutes");
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT) || 3001;

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
app.use(express.json());

//connect
mongoose.connect(
  "mongodb+srv://spathion:spathion@cluster0.e00qjcz.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useNewUrlParser: true, dbName: "Spathion" },
  (err) => {
    if (err) {
      console.log("Failure");
    } else console.log("Success");
  }
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use("/", router);

app.get("/", (req, res) => {
  res.send("Hey there!");
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use('/public', express.static('public'));
app.use(express.static(__dirname));

app.listen(PORT, function () {
  console.log("Server is listening");
});

module.exports = app;
