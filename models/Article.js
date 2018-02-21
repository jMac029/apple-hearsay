const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
let ArticleSchema = new Schema({
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
    // `comment` is an object that stores a Comment id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Comments
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }
});

// This creates our model from the above schema, using mongoose's model method
let Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;