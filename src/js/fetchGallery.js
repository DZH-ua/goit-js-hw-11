const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31544512-8bf60b33bb9dd079e91f3808d';

export const fetchGallery = name => {
  return fetch(
    `${BASE_URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    return response.json();
  });
};

//https://pixabay.com/api/?key=31544512-8bf60b33bb9dd079e91f3808d&q=yellow+flowers&image_type=photo
// var API_KEY = '31544512-8bf60b33bb9dd079e91f3808d';
// var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent('red roses');
// $.getJSON(URL, function(data){
// if (parseInt(data.totalHits) > 0)
//     $.each(data.hits, function(i, hit){ console.log(hit.pageURL); });
// else
//     console.log('No hits');
// });
