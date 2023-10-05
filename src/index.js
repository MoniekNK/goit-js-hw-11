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

  const images = await fetchImages(currentQuery, currentPage);
  displayImages(images);

  if (images.length > 0) {
    loadMoreButton.style.display = 'block';
  } else {
    notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage++;
  const images = await fetchImages(currentQuery, currentPage);
  displayImages(images);
});

async function fetchImages(query, page) {
  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  const data = await response.json();
  return data.hits;
}

function displayImages(images) {
  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    infoDiv.appendChild(likes);
    infoDiv.appendChild(views);
    infoDiv.appendChild(comments);
    infoDiv.appendChild(downloads);

    photoCard.appendChild(img);
    photoCard.appendChild(infoDiv);

    gallery.appendChild(photoCard);
  });

  if (images.length === 0) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  let currentPage = 1;
  let maxPages = 1;

  async function loadImages(query, page) {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?page=${page}&per_page=40&q=${query}`
      );
      const data = response.data;
      maxPages = Math.ceil(data.totalHits / 40);

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

  document.getElementById('load-more').addEventListener('click', () => {
    currentPage++;
    loadImages('WYSZUKANE_SLOWO', currentPage);
  });

  loadImages('WYSZUKANE_SLOWO', currentPage);
  const data = response.data;
  maxPages = Math.ceil(data.totalHits / 40);

  if (data.hits.length === 0) {
    Notiflix.Notify.Failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
  }
}
