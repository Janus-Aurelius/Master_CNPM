// src/services/database/databaseService.ts
import { Database } from '../../config/database';

export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
}

export class DatabaseService {    /**
     * Execute a query with parameters
     */
    static async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        try {
            const result = await Database.query(sql, params);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
            throw new Error(`Database query failed: ${errorMessage}`);
        }
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
        // Note: This is a simplified transaction implementation
        // In production, you should use proper PostgreSQL transactions
        const results = [];
        
        for (const query of queries) {
            const result = await this.query(query.sql, query.params);
            results.push(result);
        }
        
        return results;
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
        // Get total count
        const countSql = `SELECT COUNT(*) as count FROM (${sql}) as count_query`;
        const countResult = await this.query<{ count: string }>(countSql, params);
        const total = parseInt(countResult[0].count);
        
        // Get paginated data
        const offset = (page - 1) * limit;
        const paginatedSql = `${sql} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        const data = await this.query<T>(paginatedSql, [...params, limit, offset]);
        
        return {
            data,
            total,
            page,
            limit
        };
    }
}
