-- ============================================================
--  Stark Consolidate Finance — MySQL Database Schema
--  Run this file once to set up the database:
--    mysql -u root -p < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS stark_bank
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stark_bank;

-- ----------------------------------------------------------------
-- 1. USERS  (login / registration)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT          AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(120) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(20)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,       -- BCrypt hash
    date_of_birth DATE,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- 2. BANK ACCOUNTS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bank_accounts (
    id               INT           AUTO_INCREMENT PRIMARY KEY,
    user_id          INT           NOT NULL,
    account_number   VARCHAR(18)   NOT NULL UNIQUE,  -- auto-generated
    account_type     ENUM('savings','checking','joint') NOT NULL DEFAULT 'savings',
    currency         CHAR(3)       NOT NULL DEFAULT 'INR',
    balance          DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    initial_deposit  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    address          TEXT,
    id_type          VARCHAR(40),
    id_number        VARCHAR(60),
    occupation       VARCHAR(80),
    employer         VARCHAR(120),
    photo_filename   VARCHAR(255),
    status           ENUM('pending','active','closed') NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------
-- 3. HOME LOAN APPLICATIONS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS home_loan_applications (
    id              INT           AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,                              -- NULL if not logged in yet
    full_name       VARCHAR(120)  NOT NULL,
    phone           VARCHAR(20)   NOT NULL,
    email           VARCHAR(150),
    loan_amount     DECIMAL(15,2) NOT NULL,
    tenure_years    INT           NOT NULL,
    interest_rate   DECIMAL(5,2)  NOT NULL,
    monthly_emi     DECIMAL(15,2) NOT NULL,
    loan_subtype    VARCHAR(60)   DEFAULT 'Dream Home Loan',
    status          ENUM('pending','under_review','approved','rejected')
                    NOT NULL DEFAULT 'pending',
    applied_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------
-- 4. GOLD LOAN APPLICATIONS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gold_loan_applications (
    id               INT           AUTO_INCREMENT PRIMARY KEY,
    user_id          INT,
    full_name        VARCHAR(120)  NOT NULL,
    mobile           VARCHAR(20)   NOT NULL,
    gold_weight_g    DECIMAL(8,3)  NOT NULL,          -- adjusted weight
    eligible_amount  DECIMAL(15,2) NOT NULL,
    interest_rate    DECIMAL(5,2)  NOT NULL,
    tenure_months    INT           NOT NULL,
    total_interest   DECIMAL(15,2) NOT NULL,
    total_payable    DECIMAL(15,2) NOT NULL,
    status           ENUM('pending','under_review','approved','rejected')
                    NOT NULL DEFAULT 'pending',
    applied_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------
-- 5. FIXED DEPOSIT APPLICATIONS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fixed_deposit_applications (
    id               INT           AUTO_INCREMENT PRIMARY KEY,
    user_id          INT,
    account_number   VARCHAR(18)   NOT NULL,
    holder_name      VARCHAR(120)  NOT NULL,
    phone            VARCHAR(20)   NOT NULL,
    address          TEXT,
    amount           DECIMAL(15,2) NOT NULL,
    term_months      INT           NOT NULL,
    interest_rate    DECIMAL(5,2)  NOT NULL DEFAULT 6.50,
    payout_type      ENUM('maturity','quarterly','monthly') NOT NULL DEFAULT 'maturity',
    fd_option        ENUM('regular','monthly-income','tax-saver') NOT NULL DEFAULT 'regular',
    nominee          VARCHAR(120),
    maturity_amount  DECIMAL(15,2),
    maturity_date    DATE,
    status           ENUM('pending','active','matured','closed')
                    NOT NULL DEFAULT 'pending',
    applied_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------
-- 6. LOAN INSTALLMENT TRACKER
--    (populated when a loan is approved; used for installment lookup)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS loan_installments (
    id               INT           AUTO_INCREMENT PRIMARY KEY,
    loan_reference   VARCHAR(20)   NOT NULL UNIQUE,  -- e.g. LN-20481
    account_number   VARCHAR(18)   NOT NULL,
    holder_name      VARCHAR(120)  NOT NULL,
    loan_type        ENUM('home','gold','personal','vehicle','education')
                    NOT NULL DEFAULT 'home',
    total_emi        DECIMAL(15,2) NOT NULL,
    next_due_date    DATE          NOT NULL,
    paid_installments INT          NOT NULL DEFAULT 0,
    total_installments INT         NOT NULL,
    status           ENUM('active','completed','overdue') NOT NULL DEFAULT 'active',
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
--  7. WITHDRAWALS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS withdrawals (
    id              INT           AUTO_INCREMENT PRIMARY KEY,
    account_number  VARCHAR(18)   NOT NULL,
    holder_name     VARCHAR(120)  NOT NULL,
    amount          DECIMAL(15,2) NOT NULL,
    withdrawal_mode VARCHAR(40)   DEFAULT 'ATM / Cash',
    status          VARCHAR(30)   DEFAULT 'success',
    requested_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- 8. SEED — demo installment row so the frontend lookup works
-- ----------------------------------------------------------------
INSERT IGNORE INTO loan_installments
    (loan_reference, account_number, holder_name, loan_type,
     total_emi, next_due_date, paid_installments, total_installments, status)
VALUES
    ('LN-20481', '123456789012', 'Demo User', 'home',
     34500.00, DATE_ADD(CURDATE(), INTERVAL 15 DAY), 3, 240, 'active'),
    ('LN-10001', '987654321098', 'Ankit Kumar', 'gold',
     8250.00,  DATE_ADD(CURDATE(), INTERVAL 7  DAY), 1, 12,  'active');

-- ----------------------------------------------------------------
-- Done
-- ----------------------------------------------------------------
