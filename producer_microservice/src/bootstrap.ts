import express, { Request, Response } from "express";
import morgan from "morgan";
import {
  sendMessage,
  disconnectProducer,
  connectProducer,
} from "./broker/broker";
import jwt from "jsonwebtoken";

let fakeDb = [
  {
    id: 1,
    name: "Ose",
    password: 12345,
  },
];
async function bootstrapApp() {
  const app = express();
  const producer = await connectProducer();
  producer.on("producer.connect", () => {
    console.log("Producer connected succesfully");
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/", async (req: Request, res: Response) => {
    const user = fakeDb.find(
      (user) => user.name === "Ose"
    ) as (typeof fakeDb)[number];
    const token = jwt.sign(user, "test-secret", { expiresIn: "5m" });
    await sendMessage(token);
    res.send("Home route");
  });

  return app;
}

async function startApp() {
  const app = await bootstrapApp();
  app.listen(3000, () => {
    console.log("Server is currently running on port 3000");
  });

  const signals = ["SIGINT", "SIGTERM", "SIGQUIT"] as const;

  for (let signal of signals) {
    process.on(signal, async () => {
      await disconnectProducer();
      console.log("Graceful shutdown i guess");
    });
  }
}

startApp();
