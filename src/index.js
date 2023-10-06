'use strict';

import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-pixabay-key'] =
  '754704-15f293fdc79a851fbfbf7bf56';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.getElementById('load-more');

const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;

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
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${axios.defaults.headers.common['x-pixabay-key']}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    const data = response.data;
    return data.hits;
  } catch (error) {
    throw error;
  }
}

function displayImages(images) {
  images.forEach(imageData => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const imageElement = document.createElement('img');
    imageElement.src = imageData.webformatURL;
    imageElement.alt = imageData.tags;
    imageElement.loading = 'lazy';

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${imageData.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${imageData.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${imageData.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${imageData.downloads}`;

    infoDiv.appendChild(likes);
    infoDiv.appendChild(views);
    infoDiv.appendChild(comments);
    infoDiv.appendChild(downloads);

    photoCard.appendChild(imageElement);
    photoCard.appendChild(infoDiv);

    gallery.appendChild(photoCard);
  });

  if (images.length < perPage) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.Info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
