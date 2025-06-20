import axiosInstance from '../axios';

// Add request interceptor to add token
axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface DashboardSummary {
    totalSubjects: number;
    totalOpenCourses: number;
    totalPrograms: number;
    pendingRequests: number;
    totalStudents?: number;
    registeredStudents?: number;
}

export interface UpcomingEvent {
    id: string;
    type: 'subject_created' | 'course_opened' | 'request_submitted' | 'program_updated' | 'subject_registration' | 'subject_cancellation';
    description: string;
    timestamp: string;
    user: string;
}

export interface StudentRequest {
    id: string;
    studentId: string;
    studentName: string;
    course: string;
    requestType: 'register' | 'cancel';
    submittedDateTime: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const dashboardApi = {
    getSummary: async (): Promise<DashboardSummary> => {
        const response = await axiosInstance.get<ApiResponse<DashboardSummary>>('/academic/dashboard/stats');
        console.log('summaryData response:', response.data);
        if (!response.data || !response.data.success) {
            throw new Error(response.data?.message || 'Failed to fetch summary data');
        }
        return response.data.data;
    },

    getUpcomingEvents: async (): Promise<UpcomingEvent[]> => {
        const response = await axiosInstance.get<ApiResponse<UpcomingEvent[]>>('/academic/dashboard/activities');
        console.log('upcomingEvents response:', response.data);
        if (!response.data || !response.data.success) {
            throw new Error(response.data?.message || 'Failed to fetch upcoming events');
        }
        return response.data.data || [];
    },    getStudentRequests: async (): Promise<StudentRequest[]> => {
        try {
            const response = await axiosInstance.get<any>('/academic/dashboard/requests');
            console.log('=== DEBUG getStudentRequests ===');
            console.log('Full response:', response);
            console.log('response.data:', response.data);
            console.log('response.data.success:', response.data?.success);
            console.log('response.data.data:', response.data?.data);
            
            // The response structure is: {success: true, data: Array(4)}
            if (!response.data || !response.data.success) {
                console.error('API response failed:', response.data);
                return [];
            }            // Access the data array from response.data.data            console.log('=== DEBUG RESPONSE STRUCTURE ===');
            console.log('response:', response);
            console.log('response.data:', response.data);
            console.log('response.data.data:', response.data.data);
            console.log('typeof response.data:', typeof response.data);
            console.log('typeof response.data.data:', typeof response.data.data);
            console.log('Object.keys(response.data.data):', Object.keys(response.data.data || {}));
            console.log('JSON.stringify(response.data.data):', JSON.stringify(response.data.data));
              // The actual data is now at: response.data.data
            const rawData = response.data.data;
            console.log('rawData:', rawData);
            console.log('rawData type:', typeof rawData);
            console.log('rawData is array:', Array.isArray(rawData));
            console.log('rawData length:', rawData?.length);
            
            if (!Array.isArray(rawData)) {
                console.error('Student requests data is not an array:', rawData);
                return [];
            }
            
            // Map the response data to match frontend interface
            const mappedData = rawData.map((item: any) => {
                console.log('Mapping item:', item);
                return {
                    id: item.id?.toString() || '',
                    studentId: item.studentid || '',
                    studentName: item.studentname || '',
                    course: item.course || '',
                    requestType: (item.requesttype || 'register') as 'register' | 'cancel',
                    submittedDateTime: item.submitteddatetime || ''
                };
            });
            
            console.log('Final mapped data:', mappedData);
            console.log('Final mapped data length:', mappedData.length);
            console.log('=== END DEBUG ===');
            
            return mappedData;
        } catch (error) {
            console.error('Error fetching student requests:', error);
            return []; // Return empty array on error
        }
    }
};