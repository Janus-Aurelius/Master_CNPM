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

export async function submitTuitionPayment(studentId: string, paymentData: any) {
  const res = await fetch(`${API_BASE}/payment-status/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error('Thanh toán thất bại');
  return res.json();
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
export async function getAllPaymentStatus(params: { semester?: string; faculty?: string; course?: string; status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params.semester) query.append('semester', params.semester);
  if (params.faculty) query.append('faculty', params.faculty);
  if (params.course) query.append('course', params.course);
  if (params.status) query.append('status', params.status);
  if (params.search) query.append('search', params.search);
  const res = await fetch(`${API_BASE}/payment-status?${query.toString()}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được danh sách trạng thái thanh toán');
  return res.json();
}

// Lấy trạng thái thanh toán của 1 sinh viên
export async function getStudentPaymentStatus(studentId: string) {
  const res = await fetch(`${API_BASE}/payment-status/${studentId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được trạng thái thanh toán sinh viên');
  return res.json();
}

// Xác nhận/thay đổi trạng thái thanh toán
export async function validatePaymentStatus(studentId: string, data: any) {
  const res = await fetch(`${API_BASE}/payment-status/${studentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Cập nhật trạng thái thanh toán thất bại');
  return res.json();
}

// Lấy lịch sử thanh toán của sinh viên
export async function getStudentReceipts(studentId: string) {
  const res = await fetch(`${API_BASE}/receipts?studentId=${studentId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được lịch sử thanh toán');
  return res.json();
} 