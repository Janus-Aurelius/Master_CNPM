import * as roleService from '../../services/AdminService/roleService';

export const getAllRoles = async () => {
    return await roleService.getAllRoles();
};