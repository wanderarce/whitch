import axios from 'axios';

const api = axios.create({
  baseURL: 'https://whichis.com.br/api/v1/'
  //baseURL: 'http://192.168.0.11:80/api/v1/'
});

export default api;
