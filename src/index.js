'use strict';

import axios from 'axios';
axios.defaults.headers.common['x-pixabay-key'] =
  '754704-15f293fdc79a851fbfbf7bf56';

import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.getElementById('load-more');

const API_KEY = '754704-15f293fdc79a851fbfbf7bf56';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  currentPage = 1;
  currentQuery = e.target.searchQuery.value;
  gallery.innerHTML = '';

  try {
    const images = await fetchImages(currentQuery, currentPage);
    displayImages(images);

    if (images.length > 0) {
      loadMoreButton.style.display = 'block';
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error('Błąd podczas wyszukiwania obrazków:', error);
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage++;
  try {
    const images = await fetchImages(currentQuery, currentPage);
    displayImages(images);
  } catch (error) {
    console.error('Błąd podczas ładowania kolejnych obrazków:', error);
  }
});

async function fetchImages(query, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  const data = response.data;
  return data.hits;
}

function displayImages(images) {
  images.forEach(image => {});

  if (images.length === 0) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  loadImages(currentQuery, currentPage);
}

async function loadImages(query, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?page=${page}&per_page=40&q=${query}`
    );
    const data = response.data;
    const maxPages = Math.ceil(data.totalHits / 40);

    if (currentPage >= maxPages) {
      document.getElementById('load-more').style.display = 'none';
      Notiflix.Notify.Info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      document.getElementById('load-more').style.display = 'block';
    }
  } catch (error) {
    console.error('Błąd podczas ładowania obrazków:', error);
  }
}
