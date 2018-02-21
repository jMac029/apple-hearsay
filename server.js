const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const mongojs = require('mongojs')
const axios = require('axios')
const cheerio = require('cheerio')

// Require all models
const db = require('./models')

const PORT = 3002;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger('dev'));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'));

// Set Handlebars.
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Import routes and give the server access to them.
// const routes = require('./controllers/index.js')

// app.use(routes)

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/appleHearsay'
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {})

app.get("/", (req, res) => {
    db.Article.find({})
        .then(function(dbArticle) {
            // If all Notes are successfully found, send them back to the client
            //res.json(dbArticle);
            res.render("index", { dbArticle })
        })
        .catch(function(err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

// A GET route for scraping the macrumors website
app.get('/scrape', (req, res) => {
    // First, we grab the body of the html with request
    axios.get('https://www.macrumors.com/').then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data)

        // grab every article class element, and do the following:
        $('.article').each(function(i, element) {
            // Save an empty result object
            var result = {}

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children('.title')
                .text()
            result.link = $(this)
                .children('.title')
                .children('a')
                .attr('href')
            result.content = $(this)
                .children('.content')
                .text()

            // clean up the link that is given from macrumors to include the https
            result.link = result.link.replace('//', 'https://')

            // console.log(result.title)
            // console.log(result.link)
            // console.log(result.content)

            if (result.title && result.link && result.content) {
                db.Article.create({
                    title: result.title,
                    link: result.link,
                    content: result.content
                }), (err, inserted) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(inserted)
                    }
                }
            }
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send('Scrape Complete');
    });
});

// Route for getting all Articles from the db
app.get('/articles', (req, res) => {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .then(function(dbArticle) {
            // If all Notes are successfully found, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get('/articles/:id', (req, res) => {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with 'note',
    // then responds with the article with the note included
    db.Article.findOne({
            _id: req.params.id
        }, (error, data) => {
            if (error) {
                console.log(error)
                res.send(error)
            } else {
                res.json(data)
            }
        }).populate('note')
        .then(function(dbArticle) {
            // If any Libraries are found, send them to the client with any associated Books
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post('/articles/:id', (req, res) => {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's 'note' property with the _id of the new note
    db.Note.create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function(dbArticle) {
            // If the User was updated successfully, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});


// Start the server
app.listen(PORT, function() {
    console.log('App running on port ' + PORT + '!');
})