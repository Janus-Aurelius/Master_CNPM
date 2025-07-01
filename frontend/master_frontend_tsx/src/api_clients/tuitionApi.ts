import axiosInstance from './axios';

// API client cho học phí/thanh toán
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/financial';

export async function getStudentTuitionStatus(studentId: string) {
  const res = await fetch(`${API_BASE}/payment-status/${studentId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được trạng thái học phí');
  return res.json();
}

export async function getStudentPaymentHistory(studentId: string) {
  const res = await fetch(`${API_BASE}/receipts?studentId=${studentId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được lịch sử thanh toán');
  return res.json();
}

export async function submitTuitionPayment(data: {
    studentId: string;
    semester: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
}) {
    return axiosInstance.post('/financial/payment/confirm', data);
}

export async function getTuitionSettings() {
  const res = await fetch(`${API_BASE}/tuition-settings`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được cài đặt học phí');
  return res.json();
}

export async function getFinancialDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được dashboard tài chính');
  return res.json();
}

export async function getAuditLogs(studentId?: string) {
  const url = studentId ? `${API_BASE}/audit-logs/${studentId}` : `${API_BASE}/audit-logs`;
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được audit log');
  return res.json();
}

export async function getReceiptById(id: string) {
  const res = await fetch(`${API_BASE}/receipts/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được biên lai');
  return res.json();
}

// Lấy danh sách trạng thái thanh toán (có filter)
export async function getAllPaymentStatus(params: Record<string, any>) {
  console.log('🔄 Calling getAllPaymentStatus with params:', params);
  
  // Check if there's any auto-injection happening
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;
  console.log('🔍 [Debug] Current user from localStorage:', user);
  console.log('🔍 [Debug] Original params passed:', params);
  
  // Check if params contain studentId that shouldn't be there
  if (params.studentId && !params.explicitStudentId) {
    console.warn('⚠️ [Debug] Detected auto-injected studentId:', params.studentId);
  }
  
  try {
    const res = await axiosInstance.get('/financial/payment/status', { params });
    console.log('✅ getAllPaymentStatus response:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ getAllPaymentStatus error:', error);
    throw error;
  }
}

export async function getStudentPaymentStatus(studentId: string) {
  const res = await axiosInstance.get(`/financial/payment/status/${studentId}`);
  return res.data;
}

export async function validatePaymentStatus(studentId: string, data: any) {
  const res = await axiosInstance.put(`/financial/payment/status/${studentId}`, data);
  return res.data;
}

// Lấy lịch sử thanh toán của sinh viên
export async function getStudentReceipts(studentId: string) {
  const res = await fetch(`${API_BASE}/receipts?studentId=${studentId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được lịch sử thanh toán');
  return res.json();
}

// Lấy danh sách các kỳ học có dữ liệu đăng ký (available semesters)
export async function getAvailableSemesters() {
  console.log('🔄 Calling getAvailableSemesters...');
  try {
    const res = await axiosInstance.get('/financial/payment/available-semesters');
    console.log('✅ getAvailableSemesters response:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ getAvailableSemesters error:', error);
    throw error;
  }
}