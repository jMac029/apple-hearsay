const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
let CommentSchema = new Schema({
    // `title` is of type String
    name: String,
    // `body` is of type String
    comment_text: String,
    // date_added for keeping comments in order by date posted
    date_added: {
        type: Date,
        default: Date.now
    }
});

// This creates our model from the above schema, using mongoose's model method
let Comments = mongoose.model("Comments", CommentSchema);

// Export the Note model
module.exports = Comments;