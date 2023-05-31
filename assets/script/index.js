'use strict';
import { select, print, selectAll } from './utilities.js';

// Element selectors
const body = select('body');
const movieSearchInput = select('.movie-search-input');
const citySearchInput = select('.city-search-input');
const movieContainer = select('.movie-container');
const movieSuggestionsBox = select('.movie-suggestions-box');
const citySuggestionsBox = select('.city-suggestions-box');

// Fetch dependencies
let movieTitles = [];
let cityNames = [];
const cityUrl = './assets/json/cities.json';
const movieUrl = 'https://api.andrespecht.dev/movies';
const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json; charset=UTF-8'},
    mode: 'cors'
};

// Functions
function displayMovies(array) {
    let movies = '';
    
    if(array.length > 0) {
        array.forEach(movie => {
            movies += `
                <div>
                    <img src="${movie.poster}">
                    <h2>${movie.title}</h2>
                </div>
            `;

            movieTitles.push(movie.title);
        });
    } else {
        movies += 'Movies not found.';
    }

    movieContainer.innerHTML = `${movies}`;
}

async function getData(url) {
    try {
        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        return data.response;
    } catch(error) {
        print(error);
    }
}

function populateCityInput(array, inputArray) {
    array.forEach(item => {
        inputArray.push(item.title);
    })
}

function autoComplete(input, array, suggestionsBox) {
    let searchString = input.value.toLowerCase();
    suggestionsBox.innerHTML = '';

    const filteredData = array.filter(title => {
        return title.toLowerCase().match(searchString);
    });

    if(filteredData.length == 0 || input.value == '') {
        suggestionsBox.classList.add('show');
        suggestionsBox.innerHTML = `
            <article>
                <p class="not-interactive">Not found.</p>
            </article>
        `;          
    }  else {
        filteredData.forEach(title => {
            suggestionsBox.classList.add('show');
            suggestionsBox.innerHTML += `
                <article>
                    <p class="search-item">${title}</p>
                </article>
            `;

            const searchItems = selectAll('.search-item');
            searchItems.forEach(item => {
                item.addEventListener('click', () => {
                    input.value = `${item.innerHTML}`;
                });
            });
        });    
    }
}

function closeSuggestionBox() {
    movieSuggestionsBox.classList.remove('show');
    movieSuggestionsBox.innerHTML = '';
    citySuggestionsBox.classList.remove('show');
    citySuggestionsBox.innerHTML = '';
}

// Event Handler Functions
movieSearchInput.addEventListener('keyup', function() {
    autoComplete(movieSearchInput, movieTitles, movieSuggestionsBox);
});
citySearchInput.addEventListener('keyup', function() {
    autoComplete(citySearchInput, cityNames, citySuggestionsBox);
});
body.addEventListener('click', (closeSuggestionBox));

displayMovies(await getData(movieUrl));
populateCityInput(await getData(cityUrl), cityNames);
