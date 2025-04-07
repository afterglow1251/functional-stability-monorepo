import { Injectable, Inject, Logger as NestLogger } from '@nestjs/common';
import {
  LoggerConfig,
  LoggerConfigInitial,
  LoggerConfigTargetsBase,
} from '../../shared/_types/logger.types';
import { Request, Response } from 'express';
import { LOGGER_CONFIG } from '../../shared/providers/logger.providers';
import { DEFAULT_TARGETS } from '../../shared/constants/logger.constants';

@Injectable()
export class LoggerService {
  private readonly nestLogger = new NestLogger(LoggerService.name);
  private readonly config: LoggerConfig;

  private durationTarget = new Map<keyof LoggerConfigInitial, boolean>([
    ['console', false],
    ['file', false],
  ]);

  private readonly ReqResTargetHandlers = new Map<
    LoggerConfigTargetsBase,
    (req: Request, res: Response) => any
  >([
    ['method', (req) => req.method],
    ['url', (req) => req.url],
    ['statusCode', (_, res) => res.statusCode],
    ['ip', (req) => req.ip],
    ['headers', (req) => req.headers],
    ['query', (req) => req.query],
    ['body', (req) => req.body],
  ]);

  constructor(@Inject(LOGGER_CONFIG) initialConfig: LoggerConfigInitial) {
    this.config = this.prepareConfig(initialConfig);
    this.updateDurationTarget();
  }

  private prepareConfig(initialConfig: LoggerConfigInitial): LoggerConfig {
    return {
      console: {
        on: initialConfig.console.on,
        targets: this.ensureTargets(initialConfig.console.targets),
      },
      file: {
        on: initialConfig.file.on,
        options: initialConfig.file.options,
        targets: this.ensureTargets(initialConfig.file.targets),
      },
    };
  }

  private ensureTargets(
    targets?: LoggerConfigTargetsBase[],
    defaultTargets: LoggerConfigTargetsBase[] = DEFAULT_TARGETS,
  ): LoggerConfigTargetsBase[] {
    if (!targets) return defaultTargets;

    const uniqueTargets = [...new Set(targets)];
    if (targets.length !== uniqueTargets.length) {
      this.nestLogger.warn(
        `Duplicate targets found in the logger configuration (check LoggerModule.forRoot()): ${[...targets].join(', ')}. Duplicates have been removed.`,
      );
    }

    return uniqueTargets;
  }

  private updateDurationTarget() {
    this.durationTarget.set(
      'console',
      this.config.console.targets.includes('duration'),
    );
    this.durationTarget.set('file', this.config.file.targets.includes('duration'));
  }

  private getLogDataForTargetLogger(
    config: { on: boolean; targets: LoggerConfigTargetsBase[] },
    req: Request,
    res: Response,
  ) {
    const logData: { [key in LoggerConfigTargetsBase]?: any } = {};

    config.targets.forEach((option) => {
      const handler = this.ReqResTargetHandlers.get(option);
      if (handler) {
        logData[option] = handler(req, res);
      }
    });

    return logData;
  }

  getConsoleLogData(req: Request, res: Response) {
    return this.getLogDataForTargetLogger(this.config.console, req, res);
  }

  getFileLogData(req: Request, res: Response) {
    return this.getLogDataForTargetLogger(this.config.file, req, res);
  }

  getDurationTarget(configKey: keyof LoggerConfigInitial): boolean {
    return this.durationTarget.get(configKey) ?? false;
  }

  getConfig() {
    return this.config;
  }
}
