const API_KEY = "e9e85d4b5cc76e74ca4843e36719cc05";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("moviesContainer");
const searchInput = document.getElementById("searchInput");
const genresContainer = document.getElementById("genresContainer");

// Modal
const modal = document.getElementById("movieModal");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalOverview = document.getElementById("modalOverview");
const modalDate = document.getElementById("modalDate");
const modalRating = document.getElementById("modalRating");
const closeBtn = document.querySelector(".close");

// 🎬 Cargar películas populares al inicio
getMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
getGenres();

// 🔎 Buscar película
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && searchInput.value.trim() !== "") {
    const query = searchInput.value.trim();
    getMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES`);
  }
});

// 📊 Obtener géneros desde TMDB
function getGenres() {
  fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`)
    .then(res => res.json())
    .then(data => showGenres(data.genres));
}

function showGenres(genres) {
  genresContainer.innerHTML = "";
  genres.forEach(g => {
    const btn = document.createElement("button");
    btn.classList.add("genre-btn");
    btn.innerText = g.name;
    btn.addEventListener("click", () => filterByGenre(g.id, btn));
    genresContainer.appendChild(btn);
  });
}

// 🎞 Mostrar películas
function showMovies(movies) {
  moviesContainer.innerHTML = "";
  movies.forEach(movie => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
    `;

    movieEl.addEventListener("click", () => openModal(movie));
    moviesContainer.appendChild(movieEl);
  });
}

// 🔍 Filtrar por género
function filterByGenre(genreId, button) {
  const allBtns = document.querySelectorAll(".genre-btn");
  allBtns.forEach(b => b.classList.remove("active"));
  button.classList.add("active");

  getMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=es-ES`);
}

// 🧠 Llamar a la API
function getMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => showMovies(data.results))
    .catch(err => console.error(err));
}

// 📋 Modal de detalles
function openModal(movie) {
  modalPoster.src = IMG_URL + movie.poster_path;
  modalTitle.textContent = movie.title;
  modalOverview.textContent = movie.overview || "Sin descripción disponible.";
  modalDate.textContent = movie.release_date || "Desconocida";
  modalRating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  modal.style.display = "flex";
}

closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});
