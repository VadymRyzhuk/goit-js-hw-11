import axios from 'axios';
export async function searchImage(query, page) {
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

  const response = await axios.get(url, { params });
  return response.data;
}
