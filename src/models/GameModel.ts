import mongoose, { Types } from "mongoose";
import { playerSchema, playerWithPointSchema } from "./PlayerModel";
import { winnerSchema } from "./WinnerModel";

export const gameSchema = new mongoose.Schema({
  playersNames: [playerWithPointSchema],
  playersCount: Number,
  pointsToWin: Number,
  dealer: playerSchema,
  deckOfCards: Number,
  finished: Boolean,
  date: Date,
  round: Number,
  currentCandidateIndex: Number,
  indexCurrentRound: Number,
  winners: [winnerSchema],
  winnerRound: { type: playerSchema, required: false },
  winCard: String,
  countWinCard: Number,
});

export const GameModel = mongoose.model("Game", gameSchema);
