# 📋 GOTOWA KOMENDA SQL DO SKOPIOWANIA

## 🚀 **DLA SZYBKIEGO STARTU - PODSTAWOWA WERSJA**

Skopiuj i wklej całą poniższą komendę do **Supabase SQL Editor**:

---

```sql
-- ===================================================================
-- SCHEMA SQL DLA HIPNOTERAPIA CRM - PODSTAWOWA WERSJA
-- Skopiuj całość i wklej do Supabase SQL Editor
-- ===================================================================

-- Włącz rozszerzenia
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Utwórz tabelę users
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('boss', 'manager', 'therapist', 'junior_therapist')),
    phone VARCHAR(20),
    hire_date DATE NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Utwórz tabelę work_sessions
CREATE TABLE IF NOT EXISTS work_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    description TEXT,
    client_id UUID,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN end_time IS NOT NULL THEN 
                EXTRACT(EPOCH FROM (end_time - start_time)) / 60
            ELSE NULL
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Utwórz tabelę clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    notes TEXT,
    assigned_therapist_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Utwórz tabelę activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_work_sessions_user_id ON work_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_work_sessions_start_time ON work_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_therapist ON clients(assigned_therapist_id);

-- Funkcja updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggery
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Polityki RLS (otwarte dla szybkiego testowania)
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for work_sessions" ON work_sessions FOR ALL USING (true);
CREATE POLICY "Allow all for clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all for activity_logs" ON activity_logs FOR ALL USING (true);

-- Przykładowe dane
INSERT INTO users (email, first_name, last_name, role, phone, hire_date, hourly_rate) VALUES
('admin@hipnoterapia.pl', 'Jan', 'Kowalski', 'boss', '+48 123 456 789', '2020-01-01', 150.00),
('maria.nowak@hipnoterapia.pl', 'Maria', 'Nowak', 'therapist', '+48 123 456 788', '2021-03-15', 120.00),
('piotr.wisniewski@hipnoterapia.pl', 'Piotr', 'Wiśniewski', 'therapist', '+48 123 456 787', '2021-06-01', 110.00),
('anna.kowalczyk@hipnoterapia.pl', 'Anna', 'Kowalczyk', 'junior_therapist', '+48 123 456 786', '2022-09-01', 80.00),
('tomasz.lewandowski@hipnoterapia.pl', 'Tomasz', 'Lewandowski', 'manager', '+48 123 456 785', '2020-11-15', 130.00)
ON CONFLICT (email) DO NOTHING;

INSERT INTO clients (first_name, last_name, email, phone, assigned_therapist_id) VALUES
('Katarzyna', 'Dąbrowska', 'k.dabrowska@email.com', '+48 987 654 321', (SELECT id FROM users WHERE email = 'maria.nowak@hipnoterapia.pl')),
('Michał', 'Zieliński', 'm.zielinski@email.com', '+48 987 654 322', (SELECT id FROM users WHERE email = 'piotr.wisniewski@hipnoterapia.pl')),
('Agnieszka', 'Szymańska', 'a.szymanska@email.com', '+48 987 654 323', (SELECT id FROM users WHERE email = 'maria.nowak@hipnoterapia.pl')),
('Robert', 'Woźniak', 'r.wozniak@email.com', '+48 987 654 324', (SELECT id FROM users WHERE email = 'anna.kowalczyk@hipnoterapia.pl'))
ON CONFLICT DO NOTHING;

INSERT INTO work_sessions (user_id, start_time, end_time, description, client_id) VALUES
(
    (SELECT id FROM users WHERE email = 'maria.nowak@hipnoterapia.pl'),
    CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '10 hours',
    CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '11 hours',
    'Sesja hipnoterapii - lęk przed publicznymi wystąpieniami',
    (SELECT id FROM clients WHERE email = 'k.dabrowska@email.com')
),
(
    (SELECT id FROM users WHERE email = 'piotr.wisniewski@hipnoterapia.pl'),
    CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '14 hours',
    CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '15 hours 30 minutes',
    'Sesja hipnoterapii - rzucanie palenia',
    (SELECT id FROM clients WHERE email = 'm.zielinski@email.com')
),
(
    (SELECT id FROM users WHERE email = 'maria.nowak@hipnoterapia.pl'),
    CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '9 hours',
    CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '10 hours 15 minutes',
    'Sesja follow-up - postęp w terapii',
    (SELECT id FROM clients WHERE email = 'k.dabrowska@email.com')
),
(
    (SELECT id FROM users WHERE email = 'anna.kowalczyk@hipnoterapia.pl'),
    CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '16 hours',
    CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '17 hours',
    'Pierwsza sesja konsultacyjna',
    (SELECT id FROM clients WHERE email = 'r.wozniak@email.com')
);

SELECT 'Schema podstawowy został pomyślnie utworzony! Możesz teraz uruchomić aplikację.' as status;
```

---

## 🎯 **CO DALEJ?**

1. **Skopiuj powyższą komendę** do Supabase SQL Editor
2. **Kliknij "Run"** - wszystko zostanie utworzone automatycznie
3. **Uruchom aplikację**: `pnpm dev`
4. **Przejdź do**: http://localhost:3000/users
5. **Testuj funkcje**: dodawanie, edytowanie, wyświetlanie statystyk

---

## ⚡ **JEŚLI CHCESZ PEŁNĄ WERSJĘ**

Zamiast powyższej komendy, skopiuj całą zawartość pliku **`supabase-complete-schema.sql`** do Supabase SQL Editor.

**Uwaga**: Pełna wersja ma ~800 linii i może dłużej się wykonywać, ale daje dostęp do wszystkich funkcjonalności systemu CRM. 