const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31544512-8bf60b33bb9dd079e91f3808d';

export const fetchGallery = name => {
  return fetch(
    `${BASE_URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    return response.json();
  });
};
