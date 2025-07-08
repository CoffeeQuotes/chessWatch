// src/utils/lichessApi.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';

const lichessApi = axios.create({
  baseURL: 'https://lichess.org/api',
  headers: {
    Accept: 'application/json',
    // --- THIS IS THE RECOMMENDED ADDITION ---
    // Identify your application. Replace with your actual domain or project name.
    'User-Agent': 'ChessWatch/1.0 (https://github.com/CoffeeQuotes/chessWatch)',
  },
  timeout: 10000,
});

// Apply the retry logic
axiosRetry(lichessApi, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response ? error.response.status >= 500 : false)
    );
  },
});

export default lichessApi;