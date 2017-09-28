import $ from 'jquery';

let results = [];
const baseUrl = 'http://localhost:3000/static/search.json';

$(document).ready(() => {
	getData(baseUrl);
});

$('.serviceFilter').click(() => {
	const query = $('form').serialize();
	const url = baseUrl + '?' + query;
	getData(url);
})

const getData = url => {
	$.ajax({
		type: 'GET',
		url: url,
	}).done(data => {
		parseData(data.search);
	});
}

const parseData = data => {
	results = data;
	results.forEach(result => {
		result.url = createUrl(result.title);
		result.shortName = createShortName(result.user);
		result.petName = getPetName(result.pet.name);
		result.shortDescription = createShortDescription(result.description);
	});
	displayResults();
}

const createUrl = title => {
	let urlified = '';
	title = title.trim().toLowerCase();
  // remove invalid characters and replace space with dash
  for (let i = 0; i < title.length; i++) {
  	if (isValidChar(title[i])) {
  		urlified += title[i];
  	} else if (title[i] === ' ') {
  		urlified += '-';
  	}
  }
  urlified = urlified.replace('--', '-');
  return urlified;
}

const isValidChar = character => {
	const alphanumeric = /^[a-z0-9_\-]+$/;
	return alphanumeric.test(character);
}

const createShortName = user => {
	let shortName = '';
	const firstName = capitalize(user.first);
	const lastInitial = user.last[0].toUpperCase() + '.';
	shortName = firstName + ' ' + lastInitial;
	return shortName;
}

const getPetName = name => {
	return capitalize(name);
}

const capitalize = string => {
	return string[0].toUpperCase() + string.slice(1);
}

const createShortDescription = description => {
	let shortDescription = description; 
	if (description.length < 48) {
		return shortDescription;
	} else if (description[47] === ' ') {
		shortDescription = description.slice(0, 47);
	} else {
		const lastSpaceIndex = description.lastIndexOf(' ', 47);
		shortDescription = description.slice(0, lastSpaceIndex);
	}
	shortDescription += '...';
	return shortDescription; 
}

const displayResults = () => {
	$('#petList').text('');
	results.forEach(result => {
		$('#petList').append('<a target="_blank" href="http://' + result.url + '">' + '<h3>' + result.title + '</h3>' +'</a>' +
			'<p>' + result.shortName + '</p>' +
			'<p>' + result.petName + '</p>' +
			'<p>' + result.shortDescription + '</p>' + '<hr>'
		);
	});
}