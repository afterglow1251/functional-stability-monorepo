type ConnectionResult = { ok: true; error: null } | { ok: false; error: Error };

async function checkHealth(fn: () => Promise<any>): Promise<ConnectionResult> {
  try {
    await fn();
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function checkDrizzleHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.execute('SELECT 1'));
}

export async function checkMikroOrmHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.em.getKnex().raw('SELECT 1'));
}

export async function checkTypeOrmHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}

export async function checkSequelizeHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}

export async function checkPrismaHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.$queryRaw`SELECT 1`);
}

export async function checkMongooseHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.db.command({ ping: 1 }));
}

export async function checkMysqlHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}

export async function checkPostgresHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}

export async function checkHttpHealth(apiUrl: string): Promise<ConnectionResult> {
  return checkHealth(async () => {
    const start = performance.now();
    let response: Response;

    try {
      response = await fetch(apiUrl);
    } catch (error) {
      throw new Error(`Failed to fetch "${apiUrl}": ${error.message}`);
    }

    const duration = performance.now() - start;

    if (!response.ok) {
      const message = `API response error: ${response.status} ${response.statusText} | URL: ${apiUrl} | Time: ${duration}ms`;
      throw new Error(message);
    }
  });
}
