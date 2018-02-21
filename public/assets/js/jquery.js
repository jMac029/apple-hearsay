// when the Fetch button is clicked
$(document).on("click", "#scrape-news-button", function() {
    console.log("clickity click click")
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