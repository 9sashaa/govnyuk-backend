import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDb } from "../src/config/db";
import { playersRouter } from "../src/routers/playersRouter";
import { gameRouter } from "../src/routers/gameRouter";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use("/players", playersRouter);
app.use("/games", gameRouter);

connectToDb().then((r) => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export { app };
