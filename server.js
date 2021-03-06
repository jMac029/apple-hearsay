const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const mongojs = require('mongojs')
const axios = require('axios')
const cheerio = require('cheerio')

// Require all models
const db = require('./models')
const Comments = require('./models/Comments.js');
const Article = require('./models/Article.js');

const PORT = 8080;

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
    Article.find().sort({ _id: -1 })
        .populate('comments')
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
            result.date_posted = $(this)
                .children('.byline')
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
                Article.create({
                        title: result.title,
                        date_posted: result.date_posted,
                        link: result.link,
                        content: result.content
                    }),
                    function(err, inserted) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(inserted)
                        }
                    }
            }
        })
        res.send('Scrape Complete.');
        function redirect() {
            window.location = '/';
        }
    });
});

// Route for getting all Articles from the db
app.get('/articles', (req, res) => {
    // TODO: Finish the route so it grabs all of the articles
    Article.find({}).populate('comments')
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
    Article.findOne({
            _id: req.params.id
        }, (error, data) => {
            if (error) {
                console.log(error)
                res.send(error)
            } else {
                res.json(data)
            }
        }).populate('comments')
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
app.post('/articles/:id', function(req, res) {
    var comment_text = req.body
    console.log(comment_text)
    var newComment = new Comments({
        body: req.body.text,
        article: req.params.id,
    });
    console.log(req.body)
    newComment.save(function(error, comment) {
        if (error) {
            console.log(error)
        } else {
            Article.findOneAndUpdate(
                {_id: req.params.id}, 
                { $push: {comments: comment}
            }).exec(function(err){
                if (err) {
                console.log(err)
                res.send(err)
                } else {
                    res.send(comment)
                }
            })
        }
    })
});

// Delete a comment
app.delete('/article/delete/:note_id/:article_id', function(req, res) {
    // Use the note id to find and delete it
    Comments.findOneAndRemove({ _id: req.params.note_id }, function(err) {
      // Log any errors
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        Article.findOneAndUpdate(
          { _id: req.params.article_id },
          { $pull: { notes: req.params.note_id } }
        )
          // Execute the above query
          .exec(function(err) {
            // Log any errors
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              // Or send the note to the browser
              res.send('Comment Deleted');
            }
          });
      }
    });
  });


// Start the server
app.listen(process.env.PORT || PORT, function() {
    console.log('App running on port ' + PORT + '!');
})