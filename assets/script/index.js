'use strict';
import { select, print, selectAll } from './utilities.js';

// Element selectors
const body = select('body');
const movieSearchInput = select('.movie-search-input');
const citySearchInput = select('.city-search-input');
const movieContainer = select('.movie-container');
const suggestionsBox = select('.suggestions-box');

// Fetch dependencies
let movieTitles = [];
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

async function getMovies() {
    try {
        const response = await fetch(movieUrl, options);

        if(!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const movies = await response.json();
        displayMovies(movies.response);
    } catch(error) {
        print(error);
    }
}

function autoCompleteForMovies() {
    let searchString = movieSearchInput.value.toLowerCase();
    suggestionsBox.innerHTML = '';

    const filteredMovieTitles = movieTitles.filter(title => {
        return title.toLowerCase().match(searchString);
    });

    if(filteredMovieTitles.length == 0 || movieSearchInput.value == '') {
        suggestionsBox.classList.add('show');
        suggestionsBox.innerHTML = `
            <article>
                <p>Movie not found.</p>
            </article>
        `;
                    
    } else {
        filteredMovieTitles.forEach(title => {
            suggestionsBox.classList.add('show');
            suggestionsBox.innerHTML += `
                <article>
                    <p class="search-item">${title}</p>
                </article>
            `;

            const searchItems = selectAll(`.search-item`);
            searchItems.forEach(item => {
                item.addEventListener('click', () => {
                    movieSearchInput.value = `${item.innerHTML}`;
                });
            });
            
        });
    }
}

function autoCompleteForCities() {

}

function closeSuggestionBox() {
    suggestionsBox.classList.remove('show');
    suggestionsBox.innerHTML = '';
}

// Event Handler Functions
movieSearchInput.addEventListener('keyup', (autoCompleteForMovies));
body.addEventListener('click', (closeSuggestionBox));

getMovies();