$(document).ready(function(){
// when the Fetch button is clicked
    $("#scrape-news-button").on('click', function() {
        console.log("scraper clicked!")
        // Make an AJAX GET request to scrape for new articles
        $.ajax({
            type: "GET",
            url: "/scrape",
        }).then(function() {
            location.reload()
        })
    });

    // When you click the submit button for a comment
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
    //                 // name: $("#name").val(),
    //                 // Value taken from comment textarea
    //                 comment_text: $("#comment").val()
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
    //     // $("#name").val("");
    //     $("#comment").val("");
    // });

    $('.saveComment').on('click', function() {
        var thisId = $(this).attr('data-id');
        if (!$('#commentText-' + thisId).val()) {
            alert('please enter a comment to submit');
        } else {
        $.ajax({
            method: 'POST',
            url: "/articles/" + thisId,
            data: {
                text: $("#commentText-" + thisId).val(),
            },
        }).done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $('#commentText-' + thisId).val('');
            $('.modalComment').modal('hide');
            window.location = '/';
            });
        }   
    });

    $('.deleteComment').on('click', function() {
        var commentId = $(this).attr('data-comment-id');
        var articleId = $(this).attr('data-article-id');
        $.ajax({
          method: 'DELETE',
          url: '/article/delete/' + commentId + '/' + articleId,
        }).done(function(data) {
          console.log(data);
          $('.modalComment').modal('hide');
          window.location = '/';
        });
    });
})