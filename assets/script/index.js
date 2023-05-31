'use strict';
import { select, print } from './utilities.js';

// Element selectors
const movieContainer = select('.movie-container');

// Fetch dependencies
const movieUrl = 'https://api.andrespecht.dev/movies';
const options = {
    method: 'GET',
    // "I want a json type of data"
    // Cross Origin Request
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

getMovies();