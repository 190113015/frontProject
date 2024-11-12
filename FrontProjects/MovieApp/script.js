const API_KEY = "eacbc1101582072d421475e696a85e52";
const searchInput = document.getElementById("search");
const movieGrid = document.getElementById("movieGrid");
const movieModal = document.getElementById("movieModal");
const addToWatchlistButton = document.getElementById("addToWatchlist");
let selectedMovie = null;

searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  if (query.length > 2) {
    searchMovies(query);
  } else {
    movieGrid.innerHTML = "";
  }
});

async function searchMovies(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`
  );
  const data = await response.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  movieGrid.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Дата релиза: ${movie.release_date}</p>
        `;
    movieCard.addEventListener("click", () => {
      showMovieDetails(movie.id);
    });
    movieGrid.appendChild(movieCard);
  });
}

async function showMovieDetails(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  selectedMovie = data;
  document.getElementById("movieTitle").innerText = data.title;
  document.getElementById("movieSynopsis").innerText = data.overview;
  document.getElementById("movieRating").innerText = data.vote_average;
  document.getElementById("movieRuntime").innerText = data.runtime;
  document.getElementById("movieReleaseDate").innerText = data.release_date;

  const castResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
  );
  const castData = await castResponse.json();
  const castList = document.getElementById("movieCast");
  castList.innerHTML = "";
  castData.cast.forEach((actor) => {
    const li = document.createElement("li");
    li.innerText = actor.name;
    castList.appendChild(li);
  });

  movieModal.style.display = "block";
}

function closeModal() {
  movieModal.style.display = "none";
}

addToWatchlistButton.addEventListener("click", () => {
  if (selectedMovie) {
    addToWatchlist(selectedMovie);
  }
});

function addToWatchlist(movie) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  alert("Фильм добавлен в Watchlist!");
}
