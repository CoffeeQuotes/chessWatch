// src/utils/lichessApi.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';

const lichessApi = axios.create({
  baseURL: 'https://lichess.org/api',
  headers: {
    Accept: 'application/json',
  },
  timeout: 10000, // Add a 10-second timeout
});

// --- THIS IS THE NEW, MORE ROBUST FIX ---
// Apply the retry logic to the lichessApi instance.
axiosRetry(lichessApi, {
  retries: 3, // Retry up to 3 times
  retryDelay: (retryCount) => {
    // Use exponential backoff for delays
    return retryCount * 1000; // 1s, 2s, 3s
  },
  retryCondition: (error) => {
    // Retry on network errors and 5xx server errors
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response ? error.response.status >= 500 : false)
    );
  },
});

export default lichessApi;