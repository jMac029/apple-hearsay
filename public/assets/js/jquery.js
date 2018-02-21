// when the Fetch button is clicked
$(document).on("click", "#scrape-news-button", function() {
    // Make an AJAX GET request to scrape for new articles
    $.ajax({
        type: "GET",
        url: "/scrape",
    }).then(function() {
        location.reload()
    })
});

// // When you click the submit button for a comment
// $(document).on("submit", "#comment-form", function() {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");
//     console.log(thisID)

//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//             method: "POST",
//             url: "/articles/" + thisId,
//             data: {
//                 // Value taken from name input
//                 name: $("#name").val(),
//                 // Value taken from comment textarea
//                 body: $("#comment").val()
//             }
//         })
//         // With that done
//         .then(function(data) {
//             // Log the response
//             console.log(data);
//             // Empty the notes section
//             $("#comment-form").empty();
//         });

//     // Also, remove the values entered in the input and textarea for note entry
//     $("#name").val("");
//     $("#comment").val("");
// });