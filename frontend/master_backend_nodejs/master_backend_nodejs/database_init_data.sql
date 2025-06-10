-- =====================================================
-- Database Initialization Script with Test Data
-- University Management System
-- =====================================================

-- This script provides comprehensive test data for the university management system
-- Run this after the main schema has been created

-- =====================================================
-- EXTENDED SAMPLE DATA FOR TESTING
-- =====================================================

-- Additional sample users for testing
INSERT INTO users (id, name, email, password, role, status) VALUES
(4, 'Nguyễn Văn A', 'sv001@student.edu', '$2b$10$hashedpassword', 'student', true),
(5, 'Trần Thị B', 'sv002@student.edu', '$2b$10$hashedpassword', 'student', true),
(6, 'Lê Văn C', 'sv003@student.edu', '$2b$10$hashedpassword', 'student', true),
(7, 'Phạm Thị D', 'sv004@student.edu', '$2b$10$hashedpassword', 'student', true),
(8, 'Hoàng Văn E', 'sv005@student.edu', '$2b$10$hashedpassword', 'student', true);

-- Sample students data
INSERT INTO students (student_id, user_id, name, email, phone, address, date_of_birth, enrollment_year, major, faculty, status, completed_credits, current_credits, required_credits, gender, hometown_district, hometown_province, is_remote_area) VALUES
('SV001', 4, 'Nguyễn Văn A', 'sv001@student.edu', '0123456789', 'Hà Nội', '2002-01-15', 2020, 'Khoa học máy tính', 'Công nghệ thông tin', 'active', 45, 18, 140, 'male', 'Ba Đình', 'Hà Nội', false),
('SV002', 5, 'Trần Thị B', 'sv002@student.edu', '0123456790', 'TP.HCM', '2002-03-20', 2020, 'Kỹ thuật phần mềm', 'Công nghệ thông tin', 'active', 42, 15, 140, 'female', 'Quận 1', 'TP.HCM', false),
('SV003', 6, 'Lê Văn C', 'sv003@student.edu', '0123456791', 'Đà Nẵng', '2002-05-10', 2020, 'Hệ thống thông tin', 'Công nghệ thông tin', 'active', 48, 12, 140, 'male', 'Hải Châu', 'Đà Nẵng', false),
('SV004', 7, 'Phạm Thị D', 'sv004@student.edu', '0123456792', 'Cần Thơ', '2002-07-25', 2020, 'Khoa học máy tính', 'Công nghệ thông tin', 'active', 36, 21, 140, 'female', 'Ninh Kiều', 'Cần Thơ', true),
('SV005', 8, 'Hoàng Văn E', 'sv005@student.edu', '0123456793', 'Hải Phòng', '2002-09-12', 2020, 'Kỹ thuật phần mềm', 'Công nghệ thông tin', 'active', 39, 18, 140, 'male', 'Hồng Bàng', 'Hải Phòng', false);

-- Additional subjects for testing
INSERT INTO subjects (subject_code, name, credits, description, prerequisite_subjects, type, department, lecturer, schedule) VALUES
('CS103', 'Cơ sở dữ liệu', 3, 'Hệ quản trị cơ sở dữ liệu', ARRAY['CS101'], 'Required', 'Công nghệ thông tin', 'TS. Nguyễn Văn X', '{"day": "Thứ 2", "session": "Tiết 1-3", "fromTo": "07:00-09:30", "room": "A101"}'),
('CS104', 'Mạng máy tính', 3, 'Mạng máy tính và Internet', ARRAY['CS101'], 'Required', 'Công nghệ thông tin', 'TS. Trần Thị Y', '{"day": "Thứ 3", "session": "Tiết 4-6", "fromTo": "09:45-12:15", "room": "A102"}'),
('CS105', 'Hệ điều hành', 3, 'Nguyên lý hệ điều hành', ARRAY['CS101', 'CS202'], 'Required', 'Công nghệ thông tin', 'PGS. Lê Văn Z', '{"day": "Thứ 4", "session": "Tiết 7-9", "fromTo": "13:30-16:00", "room": "A103"}'),
('MA102', 'Giải tích', 3, 'Giải tích toán học', ARRAY['MA101'], 'Required', 'Toán học', 'TS. Phạm Thị K', '{"day": "Thứ 5", "session": "Tiết 1-3", "fromTo": "07:00-09:30", "room": "B101"}'),
('CS201', 'Trí tuệ nhân tạo', 3, 'Nhập môn AI và Machine Learning', ARRAY['CS202', 'MA101'], 'Elective', 'Công nghệ thông tin', 'TS. Hoàng Văn L', '{"day": "Thứ 6", "session": "Tiết 4-6", "fromTo": "09:45-12:15", "room": "A104"}');

-- Open courses for current semester
INSERT INTO open_courses (subject_code, subject_name, semester, academic_year, max_students, current_students, lecturer, schedule, room, status, start_date, end_date, registration_start_date, registration_end_date, prerequisites, description) VALUES
('CS101', 'Nhập môn lập trình', 'HK1', '2024-2025', 60, 25, 'TS. Nguyễn Văn A', 'Thứ 2, 4, 6 - Tiết 1-3', 'A101', 'open', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', ARRAY[], 'Môn học cơ bản về lập trình'),
('MA101', 'Đại số tuyến tính', 'HK1', '2024-2025', 80, 45, 'TS. Trần Thị B', 'Thứ 3, 5 - Tiết 4-6', 'B101', 'open', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', ARRAY[], 'Toán học cơ bản'),
('CS202', 'Cấu trúc dữ liệu và giải thuật', 'HK1', '2024-2025', 50, 30, 'PGS. Lê Văn C', 'Thứ 2, 4 - Tiết 7-9', 'A102', 'open', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', ARRAY['CS101'], 'Cấu trúc dữ liệu nâng cao'),
('CS103', 'Cơ sở dữ liệu', 'HK1', '2024-2025', 55, 20, 'TS. Nguyễn Văn X', 'Thứ 3, 5 - Tiết 1-3', 'A103', 'open', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', ARRAY['CS101'], 'Hệ quản trị cơ sở dữ liệu'),
('CS104', 'Mạng máy tính', 'HK1', '2024-2025', 45, 15, 'TS. Trần Thị Y', 'Thứ 4, 6 - Tiết 4-6', 'A104', 'open', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', ARRAY['CS101'], 'Mạng máy tính và Internet'),
('EN101', 'Tiếng Anh cơ bản', 'HK1', '2024-2025', 40, 35, 'ThS. Phạm Thị D', 'Thứ 2, 4 - Tiết 4-6', 'C101', 'open', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', ARRAY[], 'Tiếng Anh cho sinh viên CNTT'),
('CS201', 'Trí tuệ nhân tạo', 'HK1', '2024-2025', 35, 10, 'TS. Hoàng Văn L', 'Thứ 5, 7 - Tiết 7-9', 'A105', 'open', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', ARRAY['CS202', 'MA101'], 'AI và Machine Learning');

-- Student enrollments
INSERT INTO enrollments (student_id, course_id, course_name, semester, status, credits, attendance_rate) VALUES
('SV001', 1, 'Nhập môn lập trình', 'HK1 2024-2025', 'registered', 3, 95.0),
('SV001', 2, 'Đại số tuyến tính', 'HK1 2024-2025', 'registered', 3, 92.5),
('SV001', 3, 'Cấu trúc dữ liệu và giải thuật', 'HK1 2024-2025', 'registered', 4, 88.0),
('SV002', 1, 'Nhập môn lập trình', 'HK1 2024-2025', 'registered', 3, 90.0),
('SV002', 4, 'Cơ sở dữ liệu', 'HK1 2024-2025', 'registered', 3, 87.5),
('SV002', 6, 'Tiếng Anh cơ bản', 'HK1 2024-2025', 'registered', 2, 93.0),
('SV003', 2, 'Đại số tuyến tính', 'HK1 2024-2025', 'registered', 3, 85.0),
('SV003', 5, 'Mạng máy tính', 'HK1 2024-2025', 'registered', 3, 91.0),
('SV003', 6, 'Tiếng Anh cơ bản', 'HK1 2024-2025', 'registered', 2, 89.5),
('SV004', 1, 'Nhập môn lập trình', 'HK1 2024-2025', 'registered', 3, 94.0),
('SV004', 2, 'Đại số tuyến tính', 'HK1 2024-2025', 'registered', 3, 86.0),
('SV004', 7, 'Trí tuệ nhân tạo', 'HK1 2024-2025', 'waiting', 3, 0.0),
('SV005', 3, 'Cấu trúc dữ liệu và giải thuật', 'HK1 2024-2025', 'registered', 4, 92.0),
('SV005', 4, 'Cơ sở dữ liệu', 'HK1 2024-2025', 'registered', 3, 88.5),
('SV005', 5, 'Mạng máy tính', 'HK1 2024-2025', 'registered', 3, 90.5);

-- Student grades for previous semesters
INSERT INTO grades (student_id, subject_id, subject_code, semester, midterm_grade, final_grade, total_grade, letter_grade, credits, is_passed, recorded_by) VALUES
('SV001', 1, 'CS101', 'HK2 2023-2024', 8.5, 8.0, 8.2, 'B+', 3, true, 2),
('SV001', 2, 'MA101', 'HK2 2023-2024', 7.5, 8.5, 8.1, 'B+', 3, true, 2),
('SV001', 4, 'EN101', 'HK2 2023-2024', 9.0, 8.5, 8.7, 'A-', 2, true, 2),
('SV002', 1, 'CS101', 'HK2 2023-2024', 7.0, 7.5, 7.3, 'B', 3, true, 2),
('SV002', 2, 'MA101', 'HK2 2023-2024', 8.0, 7.5, 7.7, 'B', 3, true, 2),
('SV002', 3, 'PH202', 'HK2 2023-2024', 6.5, 7.0, 6.8, 'C+', 2, true, 2),
('SV003', 1, 'CS101', 'HK2 2023-2024', 9.0, 9.5, 9.3, 'A', 3, true, 2),
('SV003', 3, 'PH202', 'HK2 2023-2024', 8.0, 8.5, 8.3, 'B+', 2, true, 2),
('SV003', 4, 'EN101', 'HK2 2023-2024', 7.5, 8.0, 7.8, 'B', 2, true, 2),
('SV004', 1, 'CS101', 'HK2 2023-2024', 6.0, 7.0, 6.6, 'C+', 3, true, 2),
('SV004', 4, 'EN101', 'HK2 2023-2024', 8.5, 9.0, 8.8, 'A-', 2, true, 2),
('SV005', 2, 'MA101', 'HK2 2023-2024', 8.5, 8.0, 8.2, 'B+', 3, true, 2),
('SV005', 3, 'PH202', 'HK2 2023-2024', 7.0, 7.5, 7.3, 'B', 2, true, 2);

-- Student subject requests
INSERT INTO student_subject_requests (student_id, student_name, type, subject_code, subject_name, request_date, reason, status, reviewed_by) VALUES
('SV001', 'Nguyễn Văn A', 'Thêm học phần', 'CS201', 'Trí tuệ nhân tạo', '2024-09-10', 'Muốn học thêm để nâng cao kiến thức AI', 'Chờ xử lý', NULL),
('SV002', 'Trần Thị B', 'Xóa học phần', 'EN101', 'Tiếng Anh cơ bản', '2024-09-08', 'Đã có chứng chỉ TOEIC 750', 'Đã duyệt', 2),
('SV003', 'Lê Văn C', 'Thêm học phần', 'CS105', 'Hệ điều hành', '2024-09-12', 'Muốn học trước để chuẩn bị cho kỳ thực tập', 'Từ chối', 2),
('SV004', 'Phạm Thị D', 'Thêm học phần', 'MA102', 'Giải tích', '2024-09-11', 'Cần đủ tín chỉ toán để học các môn nâng cao', 'Chờ xử lý', NULL),
('SV005', 'Hoàng Văn E', 'Xóa học phần', 'CS104', 'Mạng máy tính', '2024-09-09', 'Trùng lịch với môn thực tập doanh nghiệp', 'Đã duyệt', 2);

-- Academic requests
INSERT INTO academic_requests (student_id, type, status, description, response, action_by) VALUES
('SV001', 'grade_review', 'approved', 'Đề nghị xem xét lại điểm cuối kỳ môn Cơ sở dữ liệu', 'Đã xem xét và điều chỉnh điểm', 2),
('SV002', 'academic_leave', 'pending', 'Xin nghỉ học 2 tuần vì lý do sức khỏe', NULL, NULL),
('SV003', 'course_registration', 'approved', 'Đăng ký thêm môn học ngoài kế hoạch', 'Đồng ý cho đăng ký', 2),
('SV004', 'other', 'rejected', 'Xin chuyển lớp do trùng lịch làm việc', 'Không thể chuyển lớp trong thời điểm này', 2),
('SV005', 'grade_review', 'pending', 'Phúc khảo điểm thi giữa kỳ môn Cấu trúc dữ liệu', NULL, NULL);

-- Tuition records
INSERT INTO tuition_records (student_id, semester, total_amount, paid_amount, remaining_amount, status, due_date) VALUES
('SV001', 'HK1 2024-2025', 5000000, 5000000, 0, 'PAID', '2024-10-15'),
('SV002', 'HK1 2024-2025', 4000000, 2000000, 2000000, 'PARTIAL', '2024-10-15'),
('SV003', 'HK1 2024-2025', 4000000, 0, 4000000, 'PENDING', '2024-10-15'),
('SV004', 'HK1 2024-2025', 3000000, 3000000, 0, 'PAID', '2024-10-15'),
('SV005', 'HK1 2024-2025', 5000000, 1000000, 4000000, 'PARTIAL', '2024-10-15');

-- Get tuition record IDs for course items
-- Note: In a real implementation, you would use the actual UUIDs from the inserted records

-- Payments
INSERT INTO payments (student_id, amount, payment_date, status, method, description, processed_by) VALUES
('SV001', 5000000, '2024-08-20 14:30:00', 'SUCCESS', 'bank_transfer', 'Thanh toán học phí HK1 2024-2025', 3),
('SV002', 2000000, '2024-08-25 10:15:00', 'SUCCESS', 'cash', 'Thanh toán một phần học phí HK1 2024-2025', 3),
('SV004', 3000000, '2024-08-22 16:45:00', 'SUCCESS', 'online', 'Thanh toán học phí HK1 2024-2025 qua ví điện tử', 3),
('SV005', 1000000, '2024-08-30 09:20:00', 'SUCCESS', 'bank_transfer', 'Thanh toán trước một phần học phí', 3);

-- =====================================================
-- UPDATE SEQUENCES TO AVOID CONFLICTS
-- =====================================================

-- Update user sequence to avoid conflicts with inserted IDs
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- =====================================================
-- VERIFY DATA INTEGRITY
-- =====================================================

-- Update enrollment counts based on actual registrations
UPDATE open_courses SET current_students = (
    SELECT COUNT(*) 
    FROM enrollments 
    WHERE enrollments.course_id = open_courses.id 
    AND enrollments.status = 'registered'
);

-- Update student credit counts
UPDATE students SET 
    completed_credits = (
        SELECT COALESCE(SUM(credits), 0) 
        FROM grades 
        WHERE grades.student_id = students.student_id 
        AND grades.is_passed = true
    ),
    current_credits = (
        SELECT COALESCE(SUM(credits), 0) 
        FROM enrollments 
        WHERE enrollments.student_id = students.student_id 
        AND enrollments.status = 'registered'
    );

-- Update tuition paid amounts based on actual payments
UPDATE tuition_records SET 
    paid_amount = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM payments 
        WHERE payments.student_id = tuition_records.student_id 
        AND payments.status = 'SUCCESS'
        AND DATE_PART('year', payments.payment_date) = 2024
    );

-- Recalculate remaining amounts and status
UPDATE tuition_records SET 
    remaining_amount = total_amount - paid_amount,
    status = CASE 
        WHEN paid_amount >= total_amount THEN 'PAID'
        WHEN paid_amount > 0 THEN 'PARTIAL'
        ELSE 'PENDING'
    END;

-- =====================================================
-- ADDITIONAL UTILITY FUNCTIONS
-- =====================================================

-- Function to get student GPA
CREATE OR REPLACE FUNCTION calculate_student_gpa(p_student_id VARCHAR(20))
RETURNS DECIMAL(3,2) AS $$
DECLARE
    gpa DECIMAL(3,2);
BEGIN
    SELECT 
        ROUND(
            SUM(total_grade * credits) / SUM(credits), 2
        ) INTO gpa
    FROM grades 
    WHERE student_id = p_student_id 
    AND is_passed = true;
    
    RETURN COALESCE(gpa, 0.00);
END;
$$ LANGUAGE plpgsql;

-- Function to check prerequisite completion
CREATE OR REPLACE FUNCTION check_prerequisites(p_student_id VARCHAR(20), p_subject_code VARCHAR(20))
RETURNS BOOLEAN AS $$
DECLARE
    prerequisite VARCHAR(20);
    prerequisites TEXT[];
BEGIN
    -- Get prerequisites for the subject
    SELECT prerequisite_subjects INTO prerequisites
    FROM subjects 
    WHERE subject_code = p_subject_code;
    
    -- If no prerequisites, return true
    IF prerequisites IS NULL OR array_length(prerequisites, 1) IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Check if all prerequisites are completed
    FOR prerequisite IN SELECT unnest(prerequisites) LOOP
        IF NOT EXISTS (
            SELECT 1 FROM grades 
            WHERE student_id = p_student_id 
            AND subject_code = prerequisite 
            AND is_passed = true
        ) THEN
            RETURN FALSE;
        END IF;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TESTING QUERIES
-- =====================================================

-- Test query: Get student overview
-- SELECT * FROM student_overview WHERE student_id = 'SV001';

-- Test query: Get course enrollment summary
-- SELECT * FROM course_enrollment_summary WHERE semester = 'HK1' AND academic_year = '2024-2025';

-- Test query: Get student financial summary
-- SELECT * FROM student_financial_summary WHERE student_id IN ('SV001', 'SV002', 'SV003');

-- Test query: Calculate GPA
-- SELECT student_id, calculate_student_gpa(student_id) as gpa FROM students;

-- Test query: Check prerequisites
-- SELECT 'SV001' as student_id, 'CS202' as subject, check_prerequisites('SV001', 'CS202') as can_enroll;

-- =====================================================
-- END OF INITIALIZATION SCRIPT
-- =====================================================
