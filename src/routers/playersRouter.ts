import { Response, Router } from "express";
import { PlayerModel } from "../models/PlayerModel";
import mongoose from "mongoose";
import { HTTP_STATUSES } from "../utils/httpStatuses";

export const playersRouter = Router();

playersRouter.get("/", async (req, res) => {
  try {
    const users = await PlayerModel.find();
    res.status(HTTP_STATUSES.OK).send(users);
  } catch (err) {
    console.error("Error fetching players data:", err);
    res
      .status(HTTP_STATUSES.SERVER_ERROR)
      .render("index", { error: "Error fetching user data", users: [] });
  }
});
