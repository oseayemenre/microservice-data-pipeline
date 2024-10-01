import express, { Request, Response } from "express";
import morgan from "morgan";
import {
  connectConsumer,
  consumeMessage,
  disconnectConsumer,
} from "./broker/broker";
import jwt from "jsonwebtoken";

async function bootstrapApp() {
  const app = express();
  const consumer = await connectConsumer();
  consumer.on("consumer.connect", () => {
    console.log("Consumer connected succesfully");
  });

  await consumeMessage("test-topic-4", (message: string) => {
    const token = jwt.verify(message, "test-secret");

    console.log(token);
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/", async (req: Request, res: Response) => {
    res.send("Consumer");
  });

  return app;
}

async function startApp() {
  const app = await bootstrapApp();
  app.listen(5001, () => {
    console.log("Server is currently running on port 5001");
  });

  const signals = ["SIGINT", "SIGTERM", "SIGQUIT"] as const;

  for (let signal of signals) {
    process.on(signal, async () => {
      await disconnectConsumer();
      console.log("Graceful shutdown i guess");
    });
  }
}

startApp();
