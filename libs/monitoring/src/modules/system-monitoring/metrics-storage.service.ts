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

const MAX_SYSTEM_INFO_OBJECTS = 40;

@Injectable()
export class SystemInfoStorageService implements OnModuleInit {
  private db: Low<DataSchema>;

  async onModuleInit() {
    const adapter = new JSONFile<DataSchema>('system-info.json');

    this.db = new Low(adapter, { metrics: [] });

    await this.db.read();
  }

  async saveMetric(metric: Metric) {
    await this.db.read();
    this.db.data.metrics.push(metric);

    if (this.db.data.metrics.length > MAX_SYSTEM_INFO_OBJECTS) {
      this.db.data.metrics = this.db.data.metrics.slice(-MAX_SYSTEM_INFO_OBJECTS);
    }

    await this.db.write();
  }

  async getLastMetrics(limit = MAX_SYSTEM_INFO_OBJECTS): Promise<Metric[]> {
    await this.db.read();
    return [...this.db.data.metrics].slice(-limit);
  }

  async getLastRecord(): Promise<Metric> {
    await this.db.read();
    return this.db.data.metrics[this.db.data.metrics.length - 1];
  }
}
