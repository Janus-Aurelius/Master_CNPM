-- =====================================================
-- University Management System Database Schema
-- Created for Cross-Role Business Logic Integration
-- =====================================================

-- Create database (if needed)
-- CREATE DATABASE master_cnpm;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Users table for authentication and role management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'financial', 'academic')),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACADEMIC MANAGEMENT TABLES
-- =====================================================

-- Programs table for academic program definitions
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_year VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    major VARCHAR(255) NOT NULL,
    total_credit INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table for course definitions
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    prerequisite_subjects TEXT[], -- Array of prerequisite subject codes
    type VARCHAR(20) NOT NULL CHECK (type IN ('Required', 'Elective')),
    department VARCHAR(255) NOT NULL,
    lecturer VARCHAR(255),
    schedule JSONB, -- Store schedule as JSON: {day, session, fromTo, room}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Open courses table for semester course offerings
CREATE TABLE open_courses (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    max_students INTEGER NOT NULL DEFAULT 0,
    current_students INTEGER DEFAULT 0,
    lecturer VARCHAR(255),
    schedule VARCHAR(255),
    room VARCHAR(100),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    registration_start_date DATE,
    registration_end_date DATE,
    prerequisites TEXT[], -- Array of prerequisite subject codes
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_code) REFERENCES subjects(subject_code) ON UPDATE CASCADE
);

-- Program courses relationship table
CREATE TABLE program_courses (
    id SERIAL PRIMARY KEY,
    program_id UUID NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    is_required BOOLEAN DEFAULT true,
    semester_recommended INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(subject_code) ON UPDATE CASCADE,
    UNIQUE(program_id, subject_code)
);

-- =====================================================
-- STUDENT MANAGEMENT TABLES
-- =====================================================

-- Students table for student profile information
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    user_id INTEGER UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    enrollment_year INTEGER,
    major VARCHAR(255),
    faculty VARCHAR(255),
    program_id UUID,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'graduated')),
    avatar_url VARCHAR(500),
    completed_credits INTEGER DEFAULT 0,
    current_credits INTEGER DEFAULT 0,
    required_credits INTEGER DEFAULT 0,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    hometown_district VARCHAR(255),
    hometown_province VARCHAR(255),
    is_remote_area BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
);

-- Student enrollments table for course registrations
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) NOT NULL,
    course_id INTEGER NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'waiting', 'dropped', 'completed')),
    credits INTEGER NOT NULL,
    midterm_grade DECIMAL(4,2) CHECK (midterm_grade >= 0 AND midterm_grade <= 10),
    final_grade DECIMAL(4,2) CHECK (final_grade >= 0 AND final_grade <= 10),
    total_grade DECIMAL(4,2) CHECK (total_grade >= 0 AND total_grade <= 10),
    letter_grade VARCHAR(2),
    attendance_rate DECIMAL(5,2) DEFAULT 0 CHECK (attendance_rate >= 0 AND attendance_rate <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES open_courses(id) ON DELETE CASCADE
);

-- Student grades table for academic performance tracking
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    subject_id INTEGER NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    midterm_grade DECIMAL(4,2) CHECK (midterm_grade >= 0 AND midterm_grade <= 10),
    final_grade DECIMAL(4,2) CHECK (final_grade >= 0 AND final_grade <= 10),
    total_grade DECIMAL(4,2) CHECK (total_grade >= 0 AND total_grade <= 10),
    letter_grade VARCHAR(2),
    credits INTEGER NOT NULL,
    is_passed BOOLEAN DEFAULT false,
    recorded_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(student_id, subject_code, semester)
);

-- =====================================================
-- ACADEMIC REQUEST MANAGEMENT TABLES
-- =====================================================

-- Student subject requests table for academic requests
CREATE TABLE student_subject_requests (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Thêm học phần', 'Xóa học phần')),
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Chờ xử lý' CHECK (status IN ('Chờ xử lý', 'Đã duyệt', 'Từ chối')),
    reviewed_by INTEGER,
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(subject_code) ON UPDATE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- General academic requests table for other types of requests
CREATE TABLE academic_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('course_registration', 'grade_review', 'academic_leave', 'other')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    description TEXT NOT NULL,
    response TEXT,
    action_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (action_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- FINANCIAL MANAGEMENT TABLES
-- =====================================================

-- Tuition records table for student fee management
CREATE TABLE tuition_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PARTIAL', 'PAID', 'OVERPAID')),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE(student_id, semester)
);

-- Tuition course items table for course-specific fees
CREATE TABLE tuition_course_items (
    id SERIAL PRIMARY KEY,
    tuition_record_id UUID NOT NULL,
    course_id INTEGER NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tuition_record_id) REFERENCES tuition_records(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES open_courses(id) ON DELETE CASCADE
);

-- Payments table for payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tuition_record_id UUID,
    student_id VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
    method VARCHAR(50) DEFAULT 'cash' CHECK (method IN ('cash', 'bank_transfer', 'card', 'online')),
    transaction_id VARCHAR(255),
    description TEXT,
    processed_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tuition_record_id) REFERENCES tuition_records(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- Academic calendar table for semester and term management
CREATE TABLE academic_calendar (
    id SERIAL PRIMARY KEY,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(semester, academic_year)
);

-- System settings table for configuration
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Student indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_program_id ON students(program_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_enrollment_year ON students(enrollment_year);
CREATE INDEX idx_students_major ON students(major);

-- Subject indexes
CREATE INDEX idx_subjects_code ON subjects(subject_code);
CREATE INDEX idx_subjects_department ON subjects(department);
CREATE INDEX idx_subjects_type ON subjects(type);

-- Open course indexes
CREATE INDEX idx_open_courses_subject_code ON open_courses(subject_code);
CREATE INDEX idx_open_courses_semester ON open_courses(semester);
CREATE INDEX idx_open_courses_academic_year ON open_courses(academic_year);
CREATE INDEX idx_open_courses_status ON open_courses(status);

-- Enrollment indexes
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_semester ON enrollments(semester);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Grade indexes
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_subject_code ON grades(subject_code);
CREATE INDEX idx_grades_semester ON grades(semester);

-- Request indexes
CREATE INDEX idx_student_subject_requests_student_id ON student_subject_requests(student_id);
CREATE INDEX idx_student_subject_requests_status ON student_subject_requests(status);
CREATE INDEX idx_student_subject_requests_subject_code ON student_subject_requests(subject_code);
CREATE INDEX idx_student_subject_requests_request_date ON student_subject_requests(request_date);

CREATE INDEX idx_academic_requests_student_id ON academic_requests(student_id);
CREATE INDEX idx_academic_requests_status ON academic_requests(status);
CREATE INDEX idx_academic_requests_type ON academic_requests(type);

-- Financial indexes
CREATE INDEX idx_tuition_records_student_id ON tuition_records(student_id);
CREATE INDEX idx_tuition_records_semester ON tuition_records(semester);
CREATE INDEX idx_tuition_records_status ON tuition_records(status);

CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_tuition_record_id ON payments(tuition_record_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_open_courses_updated_at BEFORE UPDATE ON open_courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_subject_requests_updated_at BEFORE UPDATE ON student_subject_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_requests_updated_at BEFORE UPDATE ON academic_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tuition_records_updated_at BEFORE UPDATE ON tuition_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGERS FOR BUSINESS LOGIC
-- =====================================================

-- Function to update tuition record remaining amount
CREATE OR REPLACE FUNCTION update_tuition_remaining_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        NEW.remaining_amount = NEW.total_amount - NEW.paid_amount;
        
        -- Update status based on payment
        IF NEW.remaining_amount <= 0 THEN
            IF NEW.paid_amount > NEW.total_amount THEN
                NEW.status = 'OVERPAID';
            ELSE
                NEW.status = 'PAID';
            END IF;
        ELSIF NEW.paid_amount > 0 THEN
            NEW.status = 'PARTIAL';
        ELSE
            NEW.status = 'PENDING';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tuition_amounts BEFORE INSERT OR UPDATE ON tuition_records
    FOR EACH ROW EXECUTE FUNCTION update_tuition_remaining_amount();

-- Function to update current students count in open courses
CREATE OR REPLACE FUNCTION update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status = 'registered' THEN
            UPDATE open_courses 
            SET current_students = current_students + 1 
            WHERE id = NEW.course_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'registered' AND NEW.status = 'registered' THEN
            UPDATE open_courses 
            SET current_students = current_students + 1 
            WHERE id = NEW.course_id;
        ELSIF OLD.status = 'registered' AND NEW.status != 'registered' THEN
            UPDATE open_courses 
            SET current_students = current_students - 1 
            WHERE id = NEW.course_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.status = 'registered' THEN
            UPDATE open_courses 
            SET current_students = current_students - 1 
            WHERE id = OLD.course_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_enrollment_count 
    AFTER INSERT OR UPDATE OR DELETE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_student_count();

-- =====================================================
-- INITIAL SYSTEM DATA
-- =====================================================

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('max_credits_per_semester', '24', 'Maximum credits a student can register per semester'),
('min_gpa_for_registration', '2.0', 'Minimum GPA required for course registration'),
('credit_price', '500000', 'Price per credit in VND'),
('late_payment_fee', '50000', 'Late payment fee in VND'),
('system_maintenance', 'false', 'System maintenance mode flag'),
('registration_enabled', 'true', 'Course registration enabled flag');

-- Insert default academic calendar
INSERT INTO academic_calendar (semester, academic_year, start_date, end_date, registration_start, registration_end, is_current) VALUES
('HK1', '2023-2024', '2023-09-01', '2023-12-31', '2023-08-15', '2023-09-15', false),
('HK2', '2023-2024', '2024-01-15', '2024-05-31', '2024-01-01', '2024-01-31', false),
('HK1', '2024-2025', '2024-09-01', '2024-12-31', '2024-08-15', '2024-09-15', true);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample admin users
INSERT INTO users (name, email, password, role) VALUES
('System Admin', 'admin@university.edu', '$2b$10$hashedpassword', 'admin'),
('Academic Affairs', 'academic@university.edu', '$2b$10$hashedpassword', 'academic'),
('Financial Officer', 'financial@university.edu', '$2b$10$hashedpassword', 'financial');

-- Insert sample programs
INSERT INTO programs (id, name_year, department, major, total_credit) VALUES
(uuid_generate_v4(), 'Khoa học máy tính K2020', 'Công nghệ thông tin', 'Khoa học máy tính', 140),
(uuid_generate_v4(), 'Kỹ thuật phần mềm K2020', 'Công nghệ thông tin', 'Kỹ thuật phần mềm', 140),
(uuid_generate_v4(), 'Hệ thống thông tin K2020', 'Công nghệ thông tin', 'Hệ thống thông tin', 140);

-- Insert sample subjects
INSERT INTO subjects (subject_code, name, credits, description, type, department) VALUES
('CS101', 'Nhập môn lập trình', 3, 'Môn học cơ bản về lập trình máy tính', 'Required', 'Công nghệ thông tin'),
('MA101', 'Đại số tuyến tính', 3, 'Toán học cơ bản cho ngành CNTT', 'Required', 'Toán học'),
('PH202', 'Vật lý đại cương', 2, 'Vật lý cơ bản', 'Required', 'Vật lý'),
('EN101', 'Tiếng Anh cơ bản', 2, 'Tiếng Anh cho sinh viên CNTT', 'Required', 'Ngoại ngữ'),
('CS202', 'Cấu trúc dữ liệu và giải thuật', 4, 'Cấu trúc dữ liệu và thuật toán cơ bản', 'Required', 'Công nghệ thông tin');

-- Note: Additional sample data can be inserted as needed for testing
-- This includes sample students, enrollments, grades, requests, and financial records

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for student dashboard overview
CREATE VIEW student_overview AS
SELECT 
    s.student_id,
    s.name,
    s.email,
    s.major,
    s.faculty,
    s.completed_credits,
    s.current_credits,
    s.required_credits,
    s.status,
    COUNT(e.id) as enrolled_courses,
    AVG(g.total_grade) as current_gpa
FROM students s
LEFT JOIN enrollments e ON s.student_id = e.student_id AND e.status = 'registered'
LEFT JOIN grades g ON s.student_id = g.student_id AND g.is_passed = true
GROUP BY s.student_id, s.name, s.email, s.major, s.faculty, s.completed_credits, s.current_credits, s.required_credits, s.status;

-- View for course enrollment summary
CREATE VIEW course_enrollment_summary AS
SELECT 
    oc.id as course_id,
    oc.subject_code,
    oc.subject_name,
    oc.semester,
    oc.academic_year,
    oc.lecturer,
    oc.max_students,
    oc.current_students,
    oc.status,
    ROUND((oc.current_students::DECIMAL / oc.max_students * 100), 2) as enrollment_percentage
FROM open_courses oc;

-- View for student financial summary
CREATE VIEW student_financial_summary AS
SELECT 
    s.student_id,
    s.name,
    COALESCE(SUM(tr.total_amount), 0) as total_tuition,
    COALESCE(SUM(tr.paid_amount), 0) as total_paid,
    COALESCE(SUM(tr.remaining_amount), 0) as total_remaining,
    CASE 
        WHEN COALESCE(SUM(tr.remaining_amount), 0) = 0 THEN 'PAID'
        WHEN COALESCE(SUM(tr.paid_amount), 0) > 0 THEN 'PARTIAL'
        ELSE 'PENDING'
    END as payment_status
FROM students s
LEFT JOIN tuition_records tr ON s.student_id = tr.student_id
GROUP BY s.student_id, s.name;

-- =====================================================
-- SECURITY AND PERMISSIONS
-- =====================================================

-- Create roles for different user types (if needed)
-- Note: In production, you should set up proper user roles and permissions
-- This is a basic schema setup - implement proper access controls as needed

-- =====================================================
-- SCHEMA VERSION TRACKING
-- =====================================================

CREATE TABLE schema_versions (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_versions (version, description) VALUES 
('1.0.0', 'Initial university management system schema with cross-role integration support');

-- =====================================================
-- END OF SCHEMA
-- =====================================================