import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "consumer",
  brokers: ["localhost:29092"],
});

const consumer = kafka.consumer({ groupId: "group-2" });

export async function connectConsumer() {
  await consumer.connect();
  return consumer;
}

export async function consumeMessage(topic: string, callback: Function) {
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      callback(message.value?.toString());
    },
  });
}

export async function disconnectConsumer() {
  await consumer.disconnect();
}
