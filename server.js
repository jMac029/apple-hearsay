const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");

// Require all models
const db = require("./models");

const PORT = 3002;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

// Import routes and give the server access to them.
const routes = require("./controllers/index.js")

app.use(routes)

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/appleHearsay"
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {})


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
})