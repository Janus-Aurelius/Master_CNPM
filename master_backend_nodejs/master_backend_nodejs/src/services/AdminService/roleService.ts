import { DatabaseService } from "../database/databaseService";

export const getAllRoles = async () => {
    // Truy vấn DB
    return await DatabaseService.query(`
        SELECT MaNhom AS id, TenNhom AS name FROM NHOMNGUOIDUNG
    `);
};