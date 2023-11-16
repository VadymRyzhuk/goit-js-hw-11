import axios from 'axios';
import Notiflix from 'notiflix';

const refs = {
  submitForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let currentPage = 1;

refs.submitForm.addEventListener('submit', async event => {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value;
  currentPage = 1; // Скидаємо сторінку при новому пошуковому запиті
  const data = await searchImage(searchQuery, currentPage);
  handleSearchResult(data);
});

refs.loadMoreBtn.addEventListener('click', async () => {
  const searchQuery = refs.submitForm.elements.searchQuery.value;
  currentPage += 1; // Збільшуємо сторінку для нового запиту
  const data = await searchImage(searchQuery, currentPage);
  appendSearchResult(data);
});

async function searchImage(query, page) {
  const url = 'https://pixabay.com/api/';
  const params = {
    key: '40694926-c70ea5b8520dbc31e47b270cb',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: '40',
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error.message);
    throw error;
  }
}

function cardTemplate({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>${likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>${downloads}
      </p>
    </div>
  </div>`;
}

function handleSearchResult(data) {
  const hits = data.hits;

  if (hits.length === 0) {
    refs.gallery.innerHTML = '';
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadMoreBtn.style.display = 'none';
  } else {
    refs.loadMoreBtn.style.display = 'block';
    const markup = hits.map(cardTemplate).join('');
    refs.gallery.innerHTML = markup;
  }

  // Перевірка, чи досягнуто кінця результатів
  if (hits.length < 40 && currentPage > 1) {
    refs.loadMoreBtn.style.display = 'none';
  }
}

function appendSearchResult(data) {
  const hits = data.hits;

  if (hits.length > 0) {
    const newMarkup = hits.map(cardTemplate).join('');
    refs.gallery.innerHTML += newMarkup;
  } else {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
