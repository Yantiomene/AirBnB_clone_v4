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
				 '<div class="reviews"><h2>',
				 `<span id="${r.id}n" class="treview">Reviews</span>`,
				 `<span id="${r.id}" onclick="showReviews(this)">Show</span></h2>`,
				 `<ul id="${r.id}r"></ul>`,
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

function showReviews (obj) {
    if (obj === undefined) {
	return;
    }
    if (obj.textContent === 'Show') {
	obj.textContent = 'Hide';
	$.get(`http://${HOST}/api/v1/places/${obj.id}/reviews`, (data, textStatus) => {
	    if (textStatus === 'success') {
		$(`#${obj.id}n`).html(data.length + ' Reviews');
		for (const rev of data) {
		    displayReview(rev, obj);
		}
	    }
	});
    } else {
	obj.textContent = 'Show';
	$(`#${obj.id}n`).html('Reviews');
	$(`#${obj.id}r`).empty();
    }
}

function displayReview (rev, obj) {
    const date = new Date(rev.created_at);
    const month = date.toLocaleString('en', { month: 'long' });
    const day = getOrdinalDay(date.getDate());

    if (rev.user_id) {
	$.get(`http://${HOST}/api/v1/users/${rev.user_id}`, (data, textStatus) => {
	    if (textStatus === 'success') {
		$(`#${obj.id}r`).append(
		    `<li><h3>From ${data.first_name} ${data.last_name} the ${day + ' ' + month + ' ' + date.getFullYear()}</h3>
<p>${rev.text}</p>
</li>`);
	    }
	});
    }
}

function getOrdinalDay (day) {
    if (day === 1 || day === 21 || day === 31) return day + 'st';
    else if (day === 2 || day === 22) return day + 'nd';
    else if (day === 3 || day === 23) return day + 'rd';
    else return day + 'th';
}
