import { Pool } from 'pg';

export class Database {
    private static pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'master_cnpm',
        max: 20, // maximum number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
        connectionTimeoutMillis: 2000, // how long to wait for a connection
    });

    static async query(sql: string, params?: any[]): Promise<any> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } finally {
            client.release();
        }
    }
} 