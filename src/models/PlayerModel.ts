import mongoose from "mongoose";

export const playerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export const playerWithPointSchema = new mongoose.Schema({
  player: playerSchema,
  points: Number,
  currentRoundPoints: Number,
});

export const PlayerModel = mongoose.model("Player", playerSchema);
