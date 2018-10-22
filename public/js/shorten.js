// Get Shorten Button Event 
$('#getLinkBtn').on('click', function(){
    // AJAX POST to /url with the URL that the user entered in the input box
    let data = {url: $('#url-field').val()}

    // if Advanced mode is enable then requestedURL is additional
    if ($('#requestedURL').is(':visible')){
        data.requestedURL = $('#requestedURL').val();
    }
    $.ajax({
        url: '/url',
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: function(data){
            if (data.status){
                // display the shortened URL to the user that is returned by the server
                let resultHTML = '<a class="result" href="' + data.url + '">'
                + data.url + '</a>';
                $('#link').html(resultHTML);
                $('#link').hide().fadeIn('slow');
            }
            else{
                let resultHTML = '<h4>' + data.msg + '</h4>';
                $('#link').html(resultHTML);
            }
            
        }
    });
  
});

// Advanced Button Event 
$('#advBtn').on('click', function(){
    // Toggle the requestedURL TextBox
    $('#requestedURL').toggle("slow");
});
