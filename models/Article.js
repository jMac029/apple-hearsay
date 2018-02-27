const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true,
        unique: true,
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: false
    },
    date_posted: {
        type: String,
        required: true,
    },
    date_added: {
        type: Date,
        default: Date.now
    },
    // `comments` is an object that stores a Comment id
    // The ref property links the ObjectId to the Comments model
    // This allows us to populate the Article with an associated Comments
    comments: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Comments',
        },
    ],
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model('Article', ArticleSchema);

// Export the Article model
module.exports = Article;