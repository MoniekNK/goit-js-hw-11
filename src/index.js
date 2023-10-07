'use strict';

import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-pixabay-key'] =
  '754704-15f293fdc79a851fbfbf7bf56';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const API_KEY = '754704-15f293fdc79a851fbfbf7bf56';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;
let currentQuery = '';

const onSearch = async e => {
  e.preventDefault();
  try {
    const query = e.target.elements.searchQuery.value.trim();
    if (query === '') {
      Notiflix.Notify.warning('Enter your search query, please!');
      return;
    }

    currentQuery = query;
    currentPage = 1;

    const images = await fetchImages(currentQuery, currentPage);
    displayImages(images);
  } catch (error) {
    console.error('Błąd podczas wyszukiwania obrazków:', error);
  }
};

searchForm.addEventListener('submit', onSearch);

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
  const perPage = 40;
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    const data = response.data;
    return data.hits;
  } catch (error) {
    console.error('Błąd podczas pobierania obrazków:', error);
    return [];
  }
}

function displayImages(images) {
  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  if (images.length === 0) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.webformatURL;
      imgElement.alt = image.tags;
      gallery.appendChild(imgElement);
    });

    if (currentPage === 1) {
      loadImages(currentQuery, currentPage);
    }
  }
}

async function loadImages(query, page) {
  const perPage = 40;
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    const data = response.data;
    const maxPages = Math.ceil(data.totalHits / perPage);

    if (currentPage >= maxPages) {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.Info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreButton.style.display = 'block';
    }
  } catch (error) {
    console.error('Błąd podczas ładowania obrazków:', error);
  }
}
