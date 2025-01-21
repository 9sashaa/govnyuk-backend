import mongoose, { Types } from "mongoose";
import { playerSchema } from "./PlayerModel";

export const winnerSchema = new mongoose.Schema({
  player: playerSchema,
  points: Number,
});

export const WinnerModel = mongoose.model("Winner", winnerSchema);
