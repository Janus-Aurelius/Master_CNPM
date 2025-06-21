// src/services/database/databaseService.ts
import { Database } from '../../config/database';
import { PoolClient } from 'pg';

export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
}

export class DatabaseService {
    /**
     * Execute a query with parameters
     */
    static async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        return Database.query<T>(sql, params);
    }

    /**
     * Execute a query and return first row
     */
    static async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
        const result = await this.query<T>(sql, params);
        return result.length > 0 ? result[0] : null;
    }

    /**
     * Execute multiple queries in a transaction
     */
    static async transaction(queries: Array<{ sql: string; params?: any[] }>): Promise<any[]> {
        return Database.withClient(async (client: PoolClient) => {
            try {
                await client.query('BEGIN');
                const results = [];
                
                for (const query of queries) {
                    const result = await client.query(query.sql, query.params);
                    results.push(result.rows);
                }
                
                await client.query('COMMIT');
                return results;
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        });
    }

    /**
     * Check if a record exists
     */
    static async exists(table: string, conditions: Record<string, any>): Promise<boolean> {
        const whereClause = Object.keys(conditions)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(' AND ');
        
        const values = Object.values(conditions);
        const sql = `SELECT 1 FROM ${table} WHERE ${whereClause} LIMIT 1`;
        
        const result = await this.query(sql, values);
        return result.length > 0;
    }

    /**
     * Insert a record and return the inserted record
     */
    static async insert<T = any>(table: string, data: Record<string, any>): Promise<T> {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        
        const sql = `
            INSERT INTO ${table} (${columns.join(', ')}) 
            VALUES (${placeholders}) 
            RETURNING *
        `;
        
        const result = await this.query<T>(sql, values);
        return result[0];
    }

    /**
     * Update a record and return the updated record
     */
    static async update<T = any>(
        table: string, 
        data: Record<string, any>, 
        conditions: Record<string, any>
    ): Promise<T | null> {
        const setClause = Object.keys(data)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');
        
        const whereClause = Object.keys(conditions)
            .map((key, index) => `${key} = $${Object.keys(data).length + index + 1}`)
            .join(' AND ');
        
        const values = [...Object.values(data), ...Object.values(conditions)];
        
        const sql = `
            UPDATE ${table} 
            SET ${setClause} 
            WHERE ${whereClause} 
            RETURNING *
        `;
        
        const result = await this.query<T>(sql, values);
        return result.length > 0 ? result[0] : null;
    }

    /**
     * Delete records
     */
    static async delete(table: string, conditions: Record<string, any>): Promise<number> {
        const whereClause = Object.keys(conditions)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(' AND ');
        
        const values = Object.values(conditions);
        const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
        
        const result = await this.query(sql, values);
        return Array.isArray(result) ? result.length : 0;
    }

    /**
     * Get paginated results
     */
    static async paginate<T = any>(
        sql: string, 
        params: any[] = [], 
        page = 1, 
        limit = 10
    ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
        return Database.withClient(async (client: PoolClient) => {
            // Get total count
            const countSql = `SELECT COUNT(*) as count FROM (${sql}) as count_query`;
            const countResult = await client.query(countSql, params);
            const total = parseInt(countResult.rows[0].count);
            
            // Get paginated data
            const offset = (page - 1) * limit;
            const paginatedSql = `${sql} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            const dataResult = await client.query(paginatedSql, [...params, limit, offset]);
            
            return {
                data: dataResult.rows,
                total,
                page,
                limit
            };
        });
    }

    /**
     * Get current semester from SYSTEM_SETTINGS
     * This replaces hardcoded semester values throughout the application
     */
    static async getCurrentSemester(): Promise<string> {
        try {
            const result = await this.queryOne<{ current_semester: string }>(
                'SELECT current_semester FROM SYSTEM_SETTINGS LIMIT 1'
            );
            
            // Fallback to default if no setting found
            return result?.current_semester || 'HK1_2024';
        } catch (error) {
            console.warn('Unable to fetch current semester from SYSTEM_SETTINGS, using fallback:', error);
            return 'HK1_2024'; // Fallback value
        }
    }    /**
     * Update current semester in SYSTEM_SETTINGS
     * Should only be called by academic department
     */    static async updateCurrentSemester(semesterId: string): Promise<void> {
        await this.query(
            'UPDATE SYSTEM_SETTINGS SET current_semester = $1 WHERE id = 1',
            [semesterId]
        );
    }
}
