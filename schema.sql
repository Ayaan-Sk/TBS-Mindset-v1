-- Database Creation (Uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS chatbot_db;
-- USE chatbot_db;

-- 1. Students Table: Tracks user progress, feedback and logs.
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(50) UNIQUE NOT NULL,       -- E.g. '918007574169'
    name VARCHAR(255) NULL,
    course VARCHAR(255) DEFAULT 'Mindset',   -- Course name mapping to course content table
    next_day INT DEFAULT 1,
    day_completed INT DEFAULT 0,
    next_module INT DEFAULT 1,
    module_completed INT DEFAULT 0,
    last_msg TEXT NULL,
    question_responses TEXT NULL,
    responses TEXT NULL,
    interactive_responses TEXT NULL,
    feedback TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Course Content Table: Stores lesson text, files, options and correct answers day-by-day.
CREATE TABLE IF NOT EXISTS course_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    day_number INT NOT NULL,
    module_number INT NOT NULL,
    module_text TEXT NULL,
    list_title VARCHAR(255) NULL,
    list_options TEXT NULL,                 -- Newline separated list options
    ibody TEXT NULL,
    ibuttons TEXT NULL,                     -- Newline separated button options
    question TEXT NULL,
    correct_answer VARCHAR(255) NULL,
    file_url TEXT NULL,
    file_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_day_module (course_name, day_number, module_number)
);
