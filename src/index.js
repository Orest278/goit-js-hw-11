import axios from "axios";
import Notiflix from "notiflix";
import './style.css'

const API_KEY = "36279909-cfd4bce87e67b5b9044183ce0";
const BASE_URL = "https://pixabay.com/api/";

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let currentPage = 1;
let currentQuery = "";


loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener("submit", handleSearch);
loadMoreBtn.addEventListener("click", handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    Notiflix.Notify.warning("Search query is empty. Please enter a keyword.");
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 40,
      },
    });

    const images = response.data.hits;
    const totalHits = response.data.totalHits;
// console.log(totalHits);
    if (images.length === 0) {
      gallery.innerHTML = "";
      loadMoreBtn.classList.add("is-hidden");
      Notiflix.Notify.warning(
        "Sorry, there are no images matching your search query."
      );
      return;
    }

    gallery.innerHTML = "";
    currentPage = 1;
    currentQuery = searchQuery;
    renderGallery(images);

    if (images.length < totalHits) {
      loadMoreBtn.classList.remove("is-hidden");
    } else {
        loadMoreBtn.classList.add("is-hidden");
        Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    }
  } 
}

async function handleLoadMore() {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: currentQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 40,
        page: currentPage + 1,
      },
    });

    const images = response.data.hits;

    if (images.length === 0) {
      loadMoreBtn.classList.add("is-hidden");
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      return;
    }

    currentPage += 1;
    renderGallery(images);
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      "Something went wrong while loading more images. Please try again later."
    );
  }
}

function renderGallery(images) {
    const markup = images.map(
        ({ webformatURL, tags, likes, views, comments, downloads, }) => {
             return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}Likes</b>
    </p>
    <p class="info-item">
      <b>${views}Views</b>
    </p>
    <p class="info-item">
      <b>${comments}Comments</b>
    </p>
    <p class="info-item">
      <b>${downloads}Downloads</b>
    </p>
  </div>
</div>`
      })
        .join('');
    
    gallery.insertAdjacentHTML('beforeend', markup);
}