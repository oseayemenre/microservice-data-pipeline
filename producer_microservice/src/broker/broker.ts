import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "producer",
  brokers: ["localhost:29092"],
});

const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  return producer;
}

export async function sendMessage(message: string) {
  await producer.send({
    topic: "test-topic-4",
    messages: [
      {
        value: message,
      },
    ],
  });
}

export async function disconnectProducer() {
  await producer.disconnect();
}
