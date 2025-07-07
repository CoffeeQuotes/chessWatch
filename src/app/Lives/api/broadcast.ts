// utils/broadcast.ts
import lichessApi from "@/utils/lichessApi";


// Get top broadcast games
export const getTopBroadcasts = async (page = 1) => {
  const response = await lichessApi.get(`/broadcast/top?page=${page}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  return response.data; 
};


export const getBroadcasts = async () => {
  const response = await lichessApi.get('/broadcast', {
    responseType: 'text', // Important!
    headers: {
      Accept: 'application/x-ndjson', // NDJSON stream
    },
  });

  const lines = response.data.trim().split('\n');
  const broadcasts = lines.map((line) => JSON.parse(line));
  return broadcasts;
};