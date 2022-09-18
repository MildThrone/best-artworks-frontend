$('#work-form').submit(function (event) {
    event.preventDefault();

    var form = new FormData(this);
    form.append("record_type", "artwork");

    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: "http://localhost:5000/create",
        data: form,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            messageAlert(data['message']);
        },
        error: function (error) {
            console.log(error);
            messageAlert(error['message']);
        }
    });

    this.reset();
});

$('#artist-form').submit(function (event) {
    event.preventDefault();

    var artistForm = new FormData(this);
    artistForm.append('record_type', "artist");

    console.log(artistForm.keys());

    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: "http://localhost:5000/create",
        data: artistForm,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            messageAlert(data['message']);
        },
        error: function (error) {
            console.log(error);
            messageAlert(error['message']);
        }
    });

    this.reset();
    getArtists();
});

let worksContainer = $('.works');

$(document).ready(function(){
    /*
    *   Populate tables with data of artworks
    * */
    let results = [];

    $.ajax({
        type: "GET",
        url: "http://localhost:5000/works",
        success: function (data) {
            results = data['works'];
            // console.log(results);
            addWorks(results);
        },
        error: function (error) {
            // console.log(error);
            messageAlert(error['message']);
        }
    });
});

let works = "";
function addWorks(array) {
    let i = 0;
    while (i < array.length) {
        works += "<div class=\"work-card\">\n" +
            "            <img src="+ array[i].image +" alt=\"image\">\n" +
            "            <div class=\"work-details\">\n" +
            "                <span class=\"title\">"+ array[i].title +"</span>\n" +
            "                <div class=\"subtitle\">"+ array[i].subtitle +"</div>\n" +
            "                <article class=\"desc\">"+ array[i].description +"</article>\n" +
            "                <a href=\""+ array[i].video +"\">Video</a>\n" +
            "                <p class=\"creator\">Creator: "+ array[i].creator +"</p>\n" +
            "                <a href=\""+ array[i].link +"\">View Page</a>\n" +
            "            </div>\n" +
            "        </div>";
        i++;
    }

    worksContainer.append(works);
}

function messageAlert(message) {
    var alertBox = $(".message-alert");
    alertBox.text(message);

    alertBox.slideDown();
    setTimeout(function () {
        alertBox.slideUp();
    }, 2000);
}

let artists = $("#creators");
// $(document).ready(function () {
//    getArtists();
// });
getArtists();

function getArtists() {
    // Clear current list of artists in frontend and repopulate list
    //  with updates
    artists.text("");
    artists.append("<option value=\"\" disabled selected hidden>Select Artist</option>")

    $.get("http://localhost:5000/artists", function (data) {
        let results = data['artists'];
        // artists = data;
        let creator;
        for (var i = 0; i < results.length; i++) {
            creator = "<option value='" + results[i].id + "'> " + results[i].first_name + " " + results[i].last_name + "</option>";
            artists.append(creator);
        }
    }).fail(function () {
        messageAlert("Failed to retrieve artists.");
    });
}

$("#search-txt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".works .work-card").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        $(".load-more").hide();
    });
});