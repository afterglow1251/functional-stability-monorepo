import { MikroORM } from '@mikro-orm/mysql';
import MikroConfig from './config';

export let mikroOrm: any;

export async function initializeMikroOrm() {
  mikroOrm = await MikroORM.init(MikroConfig);
}
