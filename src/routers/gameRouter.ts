import { Router } from "express";
import { HTTP_STATUSES } from "../utils/httpStatuses";
import { GameModel } from "../models/GameModel";

export const gameRouter = Router();

gameRouter.post("/winner-round", async (req, res) => {
  try {
    const { gameId, winner, card, countCard } = req.body;
    if (card === "queen") {
      await GameModel.updateOne(
        { _id: gameId, "playersNames.player._id": winner._id },
        {
          $inc: { "playersNames.$.points": -30 * countCard },
        },
      );
    }

    await GameModel.updateOne(
      { _id: gameId },
      { $set: { winCard: card, countWinCard: countCard, winnerRound: winner } },
    );

    res.status(HTTP_STATUSES.OK).send({ message: "Updated!" });
  } catch (err) {
    console.error("Error fetching players data:", err);
    res.status(HTTP_STATUSES.SERVER_ERROR).send({ error: err, gameId: "" });
  }
});

gameRouter.post("/new-game", async (req, res) => {
  try {
    const data = req.body;
    const game = await GameModel.create(data);
    res
      .status(HTTP_STATUSES.OK)
      .send({ message: "The game is registered", gameId: game?._id });
  } catch (err) {
    console.error("Error fetching players data:", err);
    res.status(HTTP_STATUSES.SERVER_ERROR).send({ error: err, gameId: "" });
  }
});

gameRouter.get("/last-game", async (req, res) => {
  try {
    const latestGame = await GameModel.findOne().sort({ _id: -1 }); // Сортировка по убыванию _id
    res.status(HTTP_STATUSES.OK).send(latestGame);
  } catch (err) {
    console.error("Ошибка при поиске последней игры:", err);
    res
      .status(HTTP_STATUSES.SERVER_ERROR)
      .send({ message: "Error fetching last game", error: err });
  }
});

gameRouter.get("/last-game/is", async (req, res) => {
  try {
    const latestGame = await GameModel.findOne().sort({ _id: -1 });
    const result = latestGame?.finished || false;
    res.status(HTTP_STATUSES.OK).send(result);
  } catch (err) {
    console.error("Ошибка при поиске последней игры:", err);
    res
      .status(HTTP_STATUSES.SERVER_ERROR)
      .send({ message: "Error fetching last game", error: err });
  }
});

gameRouter.post("/update-points/bezdar", async (req, res) => {
  try {
    const data = req.body;
    const { gameId, player, currentPoints, pointsToWin } = data;

    await GameModel.updateOne(
      { _id: gameId, "playersNames.player._id": player._id },
      {
        $inc: { "playersNames.$.points": 40 },
      },
    );

    if (currentPoints + 40 >= pointsToWin) {
      await GameModel.updateOne(
        { _id: gameId },
        {
          $set: {
            finished: true,
            winners: [{ player, points: currentPoints + 40 }],
            countWinCard: 0,
            winCard: "",
            winnerRound: {},
            currentCandidateIndex: 0,
          },
        },
      );
    }

    res.status(HTTP_STATUSES.OK).send("");
  } catch (err) {
    console.error("Ошибка при обновлении очков:", err);
    res
      .status(HTTP_STATUSES.SERVER_ERROR)
      .send({ message: "Error update points", error: err });
  }
});

gameRouter.post("/update-points", async (req, res) => {
  try {
    const data = req.body;
    const { gameId, player, pointsForUpdate, pointsToWin } = data;

    console.log(player);
    await GameModel.updateOne(
      { _id: gameId, "playersNames.player._id": player.player._id },
      {
        $inc: {
          "playersNames.$.points": pointsForUpdate,
          currentCandidateIndex: 1,
        },
      },
    );

    if (pointsForUpdate + player.points >= pointsToWin) {
      await GameModel.updateOne(
        { _id: gameId },
        {
          $push: {
            winners: {
              player: player.player,
              points: player.points + pointsForUpdate,
            },
          },
        },
      );
    }

    res.status(HTTP_STATUSES.OK).send("");
  } catch (err) {
    console.error("Ошибка при обновлении очков:", err);
    res
      .status(HTTP_STATUSES.SERVER_ERROR)
      .send({ message: "Error update points", error: err });
  }
});

gameRouter.post("/update-round", async (req, res) => {
  try {
    const data = req.body;
    const gameId = data.gameId;

    const latestGame = await GameModel.findOne().sort({ _id: -1 });
    const players = latestGame?.playersNames;
    const playerWithMaxPoints = players?.reduce((max, current) => {
      return current.points! > max.points! ? current : max;
    }, players[0]);

    const winnersLength = latestGame?.winners?.length || 0;

    await GameModel.updateOne(
      { _id: gameId },
      {
        $inc: { round: 1 },
        $set: {
          dealer: playerWithMaxPoints?.player,
          finished: winnersLength > 0,
          countWinCard: 0,
          winCard: "",
          winnerRound: {},
          currentCandidateIndex: 0,
        },
      },
    );

    res.status(HTTP_STATUSES.OK).send("");
  } catch (err) {
    console.error("Ошибка при обновлении раунда:", err);
    res
      .status(HTTP_STATUSES.SERVER_ERROR)
      .send({ message: "Error update points", error: err });
  }
});
