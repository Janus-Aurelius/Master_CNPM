-- =====================================================
-- MIGRATION SCRIPT: Convert Enrollment Status to Boolean
-- University Management System
-- =====================================================
-- This script migrates existing enrollment data from status-based 
-- to boolean-based enrollment tracking as per supervisor's feedback

-- WARNING: This is a one-way migration. Backup your database before running!

BEGIN;

-- 1. Check if the old status column still exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enrollments' 
        AND column_name = 'status'
    ) THEN
        
        -- 2. Update existing data to boolean values
        -- Convert 'registered' and 'enrolled' -> true
        -- Convert 'waiting', 'dropped', 'cancelled' -> false
        UPDATE enrollments 
        SET is_enrolled = CASE 
            WHEN status IN ('registered', 'enrolled') THEN true
            ELSE false
        END;
        
        -- 3. Set drop_date for dropped enrollments
        UPDATE enrollments 
        SET drop_date = CURRENT_TIMESTAMP
        WHERE status IN ('waiting', 'dropped', 'cancelled') 
        AND drop_date IS NULL;
        
        -- 4. Set enrollment_date for enrolled students if missing
        UPDATE enrollments 
        SET enrollment_date = created_at
        WHERE status IN ('registered', 'enrolled') 
        AND enrollment_date IS NULL;
        
        -- 5. Drop the old status column (commented out for safety)
        -- ALTER TABLE enrollments DROP COLUMN status;
        
        RAISE NOTICE 'Migration completed successfully. Old status column preserved for safety.';
        RAISE NOTICE 'To complete migration, manually drop the status column after verification.';
        
    ELSE
        RAISE NOTICE 'Status column not found. Migration may have already been completed.';
    END IF;
END
$$;

-- 6. Update any views or functions that might reference the old column
-- (Add view updates here if needed)

-- 7. Verification queries
SELECT 
    'Current enrollment summary' as info,
    COUNT(*) as total_enrollments,
    COUNT(CASE WHEN is_enrolled = true THEN 1 END) as active_enrollments,
    COUNT(CASE WHEN is_enrolled = false THEN 1 END) as dropped_enrollments
FROM enrollments;

COMMIT;

-- =====================================================
-- POST-MIGRATION VERIFICATION
-- =====================================================
-- Run these queries after migration to verify data integrity:

-- Check for any NULL is_enrolled values
-- SELECT COUNT(*) as null_enrollment_status FROM enrollments WHERE is_enrolled IS NULL;

-- Compare student counts in courses
-- SELECT 
--     oc.subject_code,
--     oc.subject_name,
--     oc.current_students as course_count,
--     COUNT(e.id) as actual_enrolled
-- FROM open_courses oc
-- LEFT JOIN enrollments e ON oc.id = e.course_id AND e.is_enrolled = true
-- GROUP BY oc.id, oc.subject_code, oc.subject_name, oc.current_students
-- HAVING oc.current_students != COUNT(e.id);
