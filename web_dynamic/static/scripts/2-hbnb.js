$(document).ready(function() {
    const amenities = {};
    $('li input[type=checkbox]').change(function () {
	if (this.checked) {
	    amenities[this.dataset.name]= this.dataset.id;
	} else {
	    delete amenities[this.dataset.name];
	}
	$('.amenities h4').text(Object.keys(amenities).sort().join(", "));
    });
    
    $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
	if (textStatus === 'success' && data.status === 'OK') {
	    $('#api_status').addClass('available');
	} else {
	    $('#api_status').removeClass('available');
	}
    });
});
