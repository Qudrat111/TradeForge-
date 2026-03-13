import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

export abstract class BaseConsumer {
  private readonly consumer: Consumer;

  constructor(
    private readonly kafka: Kafka,
    groupId: string,
  ) {
    this.consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  async subscribe(topics: string[]): Promise<void> {
    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
    }
  }

  async run(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          await this.handleMessage(payload);
        } catch (error) {
          await this.handleError(error as Error, payload);
        }
      },
    });
  }

  protected abstract handleMessage(payload: EachMessagePayload): Promise<void>;

  protected async handleError(error: Error, payload: EachMessagePayload): Promise<void> {
    console.error('Consumer error:', {
      error: error.message,
      topic: payload.topic,
      partition: payload.partition,
    });
  }
}
