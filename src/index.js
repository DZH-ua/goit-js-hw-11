import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import { fetchGallery } from './js/fetchGallery';

console.log(axios.isCancel('something'));

// lightbox.refresh();

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-box'),
  galleryContainer: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onButtonSubmitSearchImg);

function onButtonSubmitSearchImg(event) {
  refs.galleryContainer.innerHTML = '';
  event.preventDefault();
  const imageToFind = refs.input.value.trim();
  console.log(imageToFind);

  fetchGallery(imageToFind)
    .then(images => {
      if (images.totalHits > 0) {
        console.log(images);
        console.log('Images found...');
        successSearchResult(images);
        renderGalleryCard(images);
      } else {
        console.log('No such images...');
        throw new Error(response.status);
      }
    })
    .catch(() => {
      failureSearchResult();
    })
    .finally(() => refs.form.reset());;
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
  lightbox();
}

function failureSearchResult() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function successSearchResult({ totalHits }) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function infoSearchResult() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function lightbox() {
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}
