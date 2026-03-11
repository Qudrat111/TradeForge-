import { Kafka, Producer, ProducerRecord, RecordMetadata } from 'kafkajs';

export interface IBaseProducer {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publish(topic: string, key: string, value: unknown): Promise<RecordMetadata[]>;
}

export abstract class BaseProducer implements IBaseProducer {
  private readonly producer: Producer;

  constructor(
    private readonly kafka: Kafka,
    private readonly clientId: string,
  ) {
    this.producer = this.kafka.producer({
      idempotent: true,
      maxInFlightRequests: 1,
      transactionalId: `${clientId}-producer`,
    });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publish(topic: string, key: string, value: unknown): Promise<RecordMetadata[]> {
    const record: ProducerRecord = {
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
          headers: {
            'content-type': 'application/json',
            'producer-id': this.clientId,
            timestamp: Date.now().toString(),
          },
        },
      ],
    };
    return this.producer.send(record);
  }

  async publishBatch(records: ProducerRecord[]): Promise<void> {
    await this.producer.sendBatch({ topicMessages: records });
  }
}
