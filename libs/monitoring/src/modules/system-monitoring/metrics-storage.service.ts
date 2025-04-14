import { Injectable, OnModuleInit } from '@nestjs/common';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

type Metric = {
  timestamp: number;
  cpu: any;
  memory: any;
  disk: any;
  processLoad: any;
};

type DataSchema = {
  metrics: Metric[];
};

@Injectable()
export class MetricsStorageService implements OnModuleInit {
  private db: Low<DataSchema>;

  async onModuleInit() {
    const adapter = new JSONFile<DataSchema>('metrics.json');

    this.db = new Low(adapter, { metrics: [] });

    await this.db.read();
  }

  async saveMetric(metric: Metric) {
    await this.db.read();
    this.db.data.metrics.push(metric);

    if (this.db.data.metrics.length > 60) {
      this.db.data.metrics = this.db.data.metrics.slice(-60);
    }

    await this.db.write();
  }

  async getLastMetrics(limit = 10): Promise<Metric[]> {
    await this.db.read();
    return [...this.db.data.metrics].slice(-limit);
  }

  async getLastRecord(): Promise<Metric> {
    await this.db.read();
    return this.db.data.metrics[this.db.data.metrics.length - 1];
  }
}
