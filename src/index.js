'use strict';
import Notiflix from 'notiflix';
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const apiKey = '754704-15f293fdc79a851fbfbf7bf56';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const perPage = 40;
let page = 1;
loadMoreButton.style.display = 'none';

const onSearch = async e => {
  e.preventDefault();
  console.log(e.target.elements);
  try {
    const query = e.target.elements.searchQuery.value.trim();
    console.log(query);
    if (query === '') {
      Notiflix.Notify.warning('Enter your search query, please!');
      return;
    }

    const data = await searchPhoto(query, page);

    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery(data.hits);

      const totalHits = data.totalHits;
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      //
      if (data.totalHits <= page * perPage) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        loadMoreButton.style.display = 'block';
      }
    }
  } catch (err) {
    console.error('Error:', err);
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.'
    );
  }
};

searchForm.addEventListener('submit', onSearch);

const galleryElements = images => {
  const galleryHTML = images
    .map(image => {
      return `
        <div class="photo-card">
          <a class="photo-card__link" href="${image.largeImageURL}">
            <img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      `;
    })
    .join('');
};
