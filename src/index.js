import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import GalleryApiService from './js/fetchGallery';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-box'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const galleryApiService = new GalleryApiService();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onButtonSubmitSearchImg);
refs.loadMoreBtn.addEventListener('click', fetchImagesGallery);

function onButtonSubmitSearchImg(event) {
  event.preventDefault();
  galleryApiService.query = event.currentTarget.elements.searchQuery.value;

  if (galleryApiService.query === '') {
    return;
  }
  galleryApiService.resetPage();

  clearGalleryContainer();
  fetchImagesGallery();
}

async function fetchImagesGallery() {
  try {
    await galleryApiService
      .fetchGallery()
      .then(images => {
        checkSeacrhResult(images);
      })
      .finally(() => refs.form.reset());
  } catch (error) {
    error;
  }
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

function smoothScrolling() {
  if (galleryApiService.page > 1) {
    const { height: cardHeight } =
      refs.galleryContainer.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 0.7,
      behavior: 'smooth',
    });
  }
}

function checkSeacrhResult(result) {
  if (result.hits.length > 0) {
    console.log(result);
    console.log('Images found...');
    loadMoreButtonCondition(result);
    successSearchResult(result);
    renderGalleryCard(result);
    smoothScrolling();
    galleryApiService.incrementPage();
  } else if (result.totalHits === 0) {
    refs.loadMoreBtn.classList.add('is-hidden');
    console.log('No such images....');
    throw new Error(failureSearchResult());
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
    console.log('No images for load....');
    throw new Error(infoSearchResult());
  }
}

function loadMoreButtonCondition(result) {
  if (result.totalHits > 40) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}
