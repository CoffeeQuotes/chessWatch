// utils/lichessApi.ts
import axios from 'axios';

const lichessApi = axios.create({
  baseURL: 'https://lichess.org/api',
  headers: {
    Accept: 'application/json',
  },
});

export default lichessApi;
