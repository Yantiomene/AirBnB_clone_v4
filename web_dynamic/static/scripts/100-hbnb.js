$(document).ready(init);
    const amenityObj = {};
    const stateObj = {};
    const cityObj = {};
    const HOST = '0.0.0.0:5001';
    let obj = {};


function init () {
    $('.amenities .popover input').change(function () { obj = amenityObj; getChecked.call(this, 1); });
    $('.state_input').change(function () { obj = stateObj; getChecked.call(this, 2); });
    $('.city_input').change(function () { obj = cityObj; getChecked.call(this, 3); });

    $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
	if (textStatus === 'success' && data.status === 'OK') {
	    $('#api_status').addClass('available');
	} else {
	    $('#api_status').removeClass('available');
	}
    });

    getPlaces();
}

function getChecked (objId) {
    if (this.checked) {
	obj[this.dataset.name]= this.dataset.id;
    } else {
	delete obj[this.dataset.name];
    }

    const names = Object.keys(obj);
    if (objId === 1) {
	$('.amenities h4').text(names.sort().join(", "));
    } else if (objId === 2) {
	$('.locations h4').text(names.sort().join(', '));
    }
}



function getPlaces () {
    const url = `http://${HOST}/api/v1/places_search/`;
    $.ajax({
	url: url,
	type: 'POST',
	headers: { 'content-type': 'application/json' },
	data: JSON.stringify({
	    amenities: Object.values(amenityObj),
	    states: Object.values(stateObj),
	    cities: Object.values(cityObj)
	}),
	success: function (response) {
	    $('SECTION.places').empty();
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
