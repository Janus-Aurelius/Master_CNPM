// src/services/AdminService/systemService.ts
import { DatabaseService } from '../database/databaseService';

export const securityService = {
    async getSecuritySettings() {
        const settings = await DatabaseService.query(`
            SELECT setting_key, setting_value, setting_type
            FROM system_settings
            WHERE setting_key LIKE 'security_%'
        `);
        const result: any = {};
        settings.forEach((row: any) => {
            const key = row.setting_key.replace('security_', '');
            let value: any = row.setting_value;
            if (row.setting_type === 'number') value = Number(value);
            if (row.setting_type === 'boolean') value = value === 'true';
            if (row.setting_type === 'json') value = JSON.parse(value);
            result[key] = value;
        });
        return result;
    },
    async updateSecuritySettings(data: any) {
        for (const key in data) {
            let value = data[key];
            let type = 'string';
            if (typeof value === 'number') type = 'number';
            if (typeof value === 'boolean') {
                type = 'boolean';
                value = value ? 'true' : 'false';
            }
            if (Array.isArray(value)) {
                type = 'json';
                value = JSON.stringify(value);
            }
            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, setting_type = $3, updated_at = NOW()
            `, [`security_${key}`, value, type]);
        }
        return { success: true };
    }
};
