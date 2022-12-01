import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import GalleryApiService from './js/fetchGallery';
import axios from 'axios';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-box'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const galleryApiService = new GalleryApiService();
const lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onButtonSubmitSearchImg);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onButtonSubmitSearchImg(event) {
  event.preventDefault();
  galleryApiService.query = event.currentTarget.elements.searchQuery.value;
  galleryApiService.resetPage();
  clearGalleryContainer();
  fetchImagesGallery();
}

function fetchImagesGallery() {
  
  galleryApiService
    .fetchGallery()
    .then(images => {
      if (images.totalHits > 0) {
        console.log(images);
        console.log('Images found...');
        refs.loadMoreBtn.classList.remove('is-hidden');
        successSearchResult(images);
        renderGalleryCard(images);
        galleryApiService.incrementPage();
      } else {
        console.log('No such images....');
        throw new Error();
      }
    })
    .catch(() => {
      refs.loadMoreBtn.classList.add('is-hidden');
      failureSearchResult();
    })
    .finally(() => refs.form.reset());
}

function renderGalleryCard({ hits }) {
  console.log(`Rendering...`);
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="gallery__item" href="${largeImageURL}">
            <div class="photo-card">
                <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes: </b>
                        ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views:</b>
                        ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments:</b>
                        ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads:</b>
                        ${downloads}
                    </p>
                </div>
            </div>
        </a>`;
      }
    )
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function onLoadMoreBtn() {

  galleryApiService
    .fetchGallery()
    .then(images => {
      if (images.hits.length > 0) {
        renderGalleryCard(images);
        galleryApiService.incrementPage();
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      refs.loadMoreBtn.classList.add('is-hidden');
      infoSearchResult();
    });
}

function failureSearchResult() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function successSearchResult({ totalHits }) {
  if (galleryApiService.page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

function infoSearchResult() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
