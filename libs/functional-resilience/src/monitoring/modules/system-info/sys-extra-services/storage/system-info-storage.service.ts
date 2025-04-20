import { Injectable, OnModuleInit } from '@nestjs/common';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import {
  Cpu,
  Disk,
  Memory,
  ProcessLoad,
} from '../../shared/_types/system-info.types';

type Metric = {
  timestamp: number;
  cpu: Cpu;
  memory: Memory;
  disk: Disk[];
  processLoad: ProcessLoad[];
};

type DataSchema = {
  metrics: Metric[];
};

const MAX_SYSTEM_INFO_OBJECTS = 80;

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

  async getLastRecord(): Promise<Metric | undefined> {
    await this.db.read();
    return this.db.data.metrics.at(-1);
  }
}
