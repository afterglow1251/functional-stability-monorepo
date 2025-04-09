// import { Controller, Logger } from '@nestjs/common';
// import { HealthcheckDbConfig } from './shared/_types';

// export function createHealthcheckController(config: HealthcheckDbConfig): any {
//   @Controller('healthcheck')
//   class DynamicHealthcheckController {
//     private readonly logger = new Logger('HealthcheckController');

//     async checkDbHealth(fn: () => Promise<any>) {
//       try {
//         await fn();
//         return { status: 'OK' };
//       } catch (error) {
//         this.logger.error('Health check failed:', error.stack);
//         return { status: 'ERROR', error: error.message };
//       }
//     }
//   }

//   if (config.drizzle) {
//     Object.defineProperty(DynamicHealthcheckController.prototype, 'checkDrizzle', {
//       value: function () {
//         return this.checkDbHealth(() => config.drizzle.execute('SELECT 1'));
//       },
//     });
//     Reflect.defineMetadata(
//       'path',
//       'check_drizzle',
//       DynamicHealthcheckController.prototype.checkDrizzle,
//     );
//     Reflect.defineMetadata(
//       'method',
//       'get',
//       DynamicHealthcheckController.prototype.checkDrizzle,
//     );
//   }

//   // repeat for each db...

//   return DynamicHealthcheckController;
// }
