$(document).ready(function() {
    const amenityObj = {};
    $('li input[type=checkbox]').change(function () {
	if (this.checked) {
	    amenityObj[this.dataset.name]= this.dataset.id;
	} else {
	    delete amenityObj[this.dataset.name];
	}
	$('.amenities h4').text(Object.keys(amenityObj).sort().join(", "));
    });
    
    $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
	if (textStatus === 'success' && data.status === 'OK') {
	    $('#api_status').addClass('available');
	} else {
	    $('#api_status').removeClass('available');
	}
    });

    getPlacesAmen();
});


function getPlacesAmen () {
    const url = `http://0.0.0.0:5001/api/v1/places_search/`;
    $.ajax({
	url: url,
	type: 'POST',
	headers: { 'content-type': 'application/json' },
	data: JSON.stringify({ amenities: Object.values(amenityObj) }),
	success: function (response) {
	    for (const r of response) {
		const article = ['<article>',
				 '<div class="title_box">',
				 `<h2>${r.name}</h2>`,
				 `<div class="price_by_night">$${r.price_by_night}</div>`,
				 '</div>',
				 '<div class="information">',
				 `<div class="max_guest">${r.max_guest} Guest(s)</div>`,
				 `<div class="number_rooms">${r.number_rooms} Bedroom(s)</div>`,
				 `<div class="number_bathrooms">${r.number_bathrooms} Bathroom(s)</div>`,
				 '</div>',
				 '<div class="description">',
				 `${r.description}`,
				 '</div>',
				 '</article>'];
		$('SECTION.places').append(article.join(''));
	    }
	},
	error: function (error) {
	    console.log(error);
	}
    });
}
