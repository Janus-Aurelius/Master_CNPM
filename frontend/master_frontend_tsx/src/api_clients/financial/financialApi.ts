import axios from '../axios';

export interface PriorityGroup {
    id: number;
    name: string;
    type: string;
    discount: number;
    description: string;
    priorityId?: string; // Optional field to store backend ID
}

export interface CourseType {
    courseTypeId: string;
    courseTypeName: string;
    hoursPerCredit: number;
    pricePerCredit: number;
}

export interface ApiPriorityObject {
    priorityId: string;
    priorityName: string;
    discountAmount: number;
}

// API endpoints for financial management
export const financialApi = {
    // Priority objects management
    async getPriorityObjects(): Promise<ApiPriorityObject[]> {
        const response = await axios.get('/financial/config/priority-objects');
        return (response.data as any).data;
    },

    async createPriorityObject(data: {
        priorityId: string;
        priorityName: string;
        discountAmount: number;
    }): Promise<{ success: boolean; message?: string }> {
        const response = await axios.post('/financial/config/priority-objects', data);
        return response.data as { success: boolean; message?: string };
    },

    async updatePriorityObject(priorityId: string, data: {
        priorityName?: string;
        discountAmount?: number;
    }): Promise<{ success: boolean; message?: string }> {
        const response = await axios.put(`/financial/config/priority-objects/${priorityId}`, data);
        return response.data as { success: boolean; message?: string };
    },

    async deletePriorityObject(priorityId: string): Promise<{ success: boolean; message?: string }> {
        const response = await axios.delete(`/financial/config/priority-objects/${priorityId}`);
        return response.data as { success: boolean; message?: string };
    },

    // Course types management
    async getCourseTypes(): Promise<CourseType[]> {
        const response = await axios.get('/financial/config/course-types');
        return (response.data as any).data;
    },

    async updateCourseTypePrice(courseTypeId: string, newPrice: number): Promise<{ success: boolean; message?: string }> {
        const response = await axios.put(`/financial/config/course-types/${courseTypeId}/price`, {
            newPrice
        });
        return response.data as { success: boolean; message?: string };
    },

    // Configuration summary
    async getConfigSummary(): Promise<{
        priorityObjectsCount: number;
        courseTypesCount: number;
        currentSemester: any;
        paymentDeadline: Date | null;
    }> {
        const response = await axios.get('/financial/config/summary');
        return (response.data as any).data;
    },

    async getCurrentSemester(): Promise<any> {
        const response = await axios.get('/financial/config/current-semester');
        return response.data;
    },
};

// Helper function to convert API data to component format
export const convertApiToComponentFormat = (apiData: ApiPriorityObject[]): PriorityGroup[] => {
    return apiData.map((item, index) => ({
        id: index + 1, // Use index as ID since component expects number
        name: item.priorityName,
        type: "Đối tượng ưu tiên", // Default type
        discount: Math.round(item.discountAmount * 100), // Convert decimal to percentage (0.70 -> 70)
        description: `Giảm ${Math.round(item.discountAmount * 100)}% học phí cho ${item.priorityName.toLowerCase()}`,
        priorityId: item.priorityId // Store original backend ID for API calls
    }));
};

// Helper function to convert component data to API format
export const convertComponentToApiFormat = (componentData: PriorityGroup): {
    priorityId: string;
    priorityName: string;
    discountAmount: number;
} => {
    return {
        priorityId: (componentData as any).priorityId || `UT${String(componentData.id).padStart(3, '0')}`, // Use stored priorityId or generate new
        priorityName: componentData.name,
        discountAmount: componentData.discount / 100 // Convert percentage to decimal (70 -> 0.70)
    };
};
