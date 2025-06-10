import { Pool, PoolClient } from 'pg';
import { config } from '../config';

export class Database {
    private static pool: Pool;

    static initialize() {
        if (!this.pool) {
            this.pool = new Pool(config.db);
            
            // Handle pool errors
            this.pool.on('error', (err) => {
                console.error('Unexpected error on idle client', err);
                process.exit(-1);
            });
        }
    }

    static async getClient(): Promise<PoolClient> {
        if (!this.pool) {
            this.initialize();
        }
        return await this.pool.connect();
    }

    static async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        const client = await this.getClient();
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } finally {
            client.release();
        }
    }

    static async withClient<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.getClient();
        try {
            return await callback(client);
        } finally {
            client.release();
        }
    }

    static async end() {
        if (this.pool) {
            await this.pool.end();
        }
    }
} 