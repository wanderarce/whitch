import axios from 'axios';

const api = axios.create({
  baseURL: 'https://whichis.com.br/api/v1/'
});

export default api;
