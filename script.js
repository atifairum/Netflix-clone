// TMDB API Configuration
const API_KEY = 'e304efda6a87db214bced6fc9faa16d0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// API Endpoints
const endpoints = {
    trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}`,
    popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
    originals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
    topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
    upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`,
};

// Fetch movies from TMDB API
async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// Create movie card HTML
function createMovieCard(movie, isTopTen = false, index = 0, hasProgress = false) {
    const title = movie.title || movie.name;
    const imgPath = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450/2a2a2a/e50914?text=No+Image';

    let cardHTML = '<div class="movie-card';
    if (isTopTen) cardHTML += ' top-ten-card';
    cardHTML += '">';

    if (isTopTen) {
        cardHTML += `<div class="top-ten-number">${index + 1}</div>`;
    }

    cardHTML += `<img src="${imgPath}" alt="${title}">`;

    if (hasProgress) {
        const progress = Math.floor(Math.random() * 90) + 10; // Random progress between 10-100%
        cardHTML += `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>`;
    }

    cardHTML += '</div>';
    return cardHTML;
}

// Populate movie row
async function populateMovieRow(rowSelector, endpoint, isTopTen = false, hasProgress = false, limit = 10) {
    const row = document.querySelector(rowSelector);
    if (!row) return;

    const container = row.querySelector('.movie-cards-container');
    if (!container) return;

    const movies = await fetchMovies(endpoint);
    const moviesToShow = movies.slice(0, limit);

    container.innerHTML = moviesToShow.map((movie, index) =>
        createMovieCard(movie, isTopTen, index, hasProgress)
    ).join('');
}

// Initialize all movie rows when page loads
window.addEventListener('DOMContentLoaded', async () => {
    console.log('Loading TMDB movie data...');

    // Get all movie rows
    const rows = document.querySelectorAll('.movie-row');

    if (rows.length >= 1) {
        // Trending Now
        await populateMovieRow('.movie-row:nth-of-type(1)', endpoints.trending, false, false, 10);
    }

    if (rows.length >= 2) {
        // Popular on Netflix
        await populateMovieRow('.movie-row:nth-of-type(2)', endpoints.popular, false, false, 10);
    }

    if (rows.length >= 3) {
        // Netflix Originals
        await populateMovieRow('.movie-row:nth-of-type(3)', endpoints.originals, false, false, 10);
    }

    if (rows.length >= 4) {
        // Top 10 in Your Country Today
        await populateMovieRow('.movie-row:nth-of-type(4)', endpoints.topRated, true, false, 10);
    }

    if (rows.length >= 5) {
        // Continue Watching for User
        await populateMovieRow('.movie-row:nth-of-type(5)', endpoints.trending, false, true, 6);
    }

    if (rows.length >= 6) {
        // My List
        await populateMovieRow('.movie-row:nth-of-type(6)', endpoints.upcoming, false, false, 5);
    }

    console.log('TMDB movie data loaded successfully!');
});
