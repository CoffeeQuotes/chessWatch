// src/app/Lives/api/broadcast.ts
import lichessApi from "@/utils/lichessApi";

// Get top broadcast games
export const getTopBroadcasts = async (page = 1) => {
  const response = await lichessApi.get(`/broadcast/top?page=${page}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};

export const getBroadcast = async (id: string) => {
  const response = await lichessApi.get(`/broadcast/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};

// Get information about a broadcast round
export const getBroadcastRound = async (broadcastRoundId: string) => {
  const response = await lichessApi.get(
    `/broadcast/-/-/${broadcastRoundId}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

// Get the PGN for a specific broadcast game.
// Broadcast games are study chapters, so the endpoint is /study/{roundId}/{gameId}.pgn
export const getGamePGN = async (
  roundId: string,
  gameId: string
): Promise<string> => {
  const response = await lichessApi.get(
    `/study/${roundId}/${gameId}.pgn`,
    {
      headers: {
        Accept: "application/x-chess-pgn",
      },
    }
  );
  return response.data;
};