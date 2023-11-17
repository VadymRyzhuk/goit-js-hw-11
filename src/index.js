import Notiflix from 'notiflix';
import { searchImage } from './api';

const refs = {
  submitForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let currentPage = 1;

refs.submitForm.addEventListener('submit', async event => {
  try {
    event.preventDefault();
    const searchQuery = event.target.elements.searchQuery.value;
    currentPage = 1; // ===========================Скидаємо сторінку при новому пошуковому запиті
    const data = await searchImage(searchQuery, currentPage);
    handleSearchResult(data);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    throw error;
  }
});

refs.loadMoreBtn.addEventListener('click', async () => {
  try {
    const searchQuery = refs.submitForm.elements.searchQuery.value;
    currentPage += 1;
    const data = await searchImage(searchQuery, currentPage);
    appendSearchResult(data);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    throw error;
  }
});

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

    const totalHits = data.totalHits || data.total || 0;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

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
