import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31544512-8bf60b33bb9dd079e91f3808d';

export default class GalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchGallery() {
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    return await axios.get(url).then(response => response.data);
  }

  incrementPage() {
    this.page += 1;    
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
