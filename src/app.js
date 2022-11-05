const dotenv = require('dotenv');
const express = require("express");
const mongoose = require("mongoose");
const { Author, Blog } = require("../models/schema");
const approuter = require("../routes/router");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(approuter);

const port = process.env.PORT || 6969;


mongoose.connect("mongodb://localhost:27017/blogging-project", {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
    console.log("database connected successfully...");
}).catch((err) => {
    console.log(err);
})

app.get("/", approuter);

app.listen(port, (req, res) => {
    console.log(`server running at port ${port}`);
})


