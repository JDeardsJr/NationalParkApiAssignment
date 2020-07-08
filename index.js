'use strict';

const apiKey = '98NvatzYhaY6qUUj6eaEvkGLLvNWwFy0FSofApYc';

const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params) 
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    if (responseJson.total === '0') {
        $('#js-error-message').text('Something went wrong: please ensure state codes are correct and separated by a comma.');
    } else {
        for (let i = 0; i < responseJson.data.length; i++) {
            $('#results-list').append(
                `<li><h3>${responseJson.data[i].fullName}</h3>
                <p class="address">${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}</p>
                <p>${responseJson.data[i].description}</p>
                <a class="link" href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
                </li>`
            )};
        $('#js-error-message').empty();
        $('#results').removeClass('hidden');
    }
}

function getNationalParks(searchTerm, maxResults) {
    const newSearchTerm = searchTerm.split(' ').join('');
    const params = {
        stateCode: newSearchTerm,
        limit: maxResults,
        api_key: apiKey
    };
    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-state-code').val();
        const maxResults = $('#js-max-results').val();
        getNationalParks(searchTerm, maxResults);
    });
}

$(watchForm);