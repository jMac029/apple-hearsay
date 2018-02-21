// when the Fetch button is clicked
$("#scrape-news-button").on("click", function() {
    // Make an AJAX GET request to delete the notes from the db
    $.ajax({
        type: "GET",
        url: "/scrape",
        // On a successful call, clear the #results section
        success: function(response) {
            $.ajax({
                type: "GET",
                url: "/"
            })
        }
    });
});