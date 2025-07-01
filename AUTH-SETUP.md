# 🔐 Konfiguracja Autentykacji - HynoCRM

## 📋 Przegląd Systemu Autentykacji

Aplikacja HynoCRM używa pełnego systemu autentykacji z:
- 🔐 **Logowanie/rejestracja** z email + hasło
- 👤 **Profile użytkowników** przechowywane w tabeli `users`
- 🛡️ **Automatyczna ochrona** wszystkich stron poza publicznymi
- 🚪 **Automatyczne przekierowania** między stronami chronionymi a publicznymi
- 📧 **Reset hasła** przez email

---

## 🚀 **Krok 1: Konfiguracja Supabase Auth**

### 1.1 Włącz Email Auth
1. Idź do **Supabase Dashboard** > **Authentication** > **Settings**
2. Sprawdź czy **Email** provider jest włączony
3. Upewnij się że **Enable email confirmations** jest włączone

### 1.2 Skonfiguruj Email Templates (opcjonalne)
```
Authentication > Settings > Email Templates
```
- **Confirm signup**: Customize email wysyłany po rejestracji
- **Reset password**: Customize email do resetowania hasła

---

## 🗄️ **Krok 2: SQL Schema dla Autentykacji**

### 2.1 Podstawowy Trigger dla Nowych Użytkowników
Wykonaj w **Supabase SQL Editor**:

```sql
-- Trigger do automatycznego dodawania nowego użytkownika do tabeli users po rejestracji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    role,
    phone,
    hire_date,
    hourly_rate,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'therapist')::text,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CURRENT_DATE,
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::numeric, 0),
    true,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utwórz trigger na auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2.2 RLS Policy dla Tabeli Users
```sql
-- Włącz RLS na tabeli users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Użytkownicy mogą widzieć tylko siebie (dla regularnych)
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Administratorzy mogą widzieć wszystkich
CREATE POLICY "users_select_all_for_admin" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('boss', 'project_manager')
    )
  );

-- Policy: Użytkownicy mogą aktualizować swój profil
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Administratorzy mogą aktualizować wszystkich
CREATE POLICY "users_update_all_for_admin" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('boss', 'project_manager')
    )
  );
```

---

## 💻 **Krok 3: Konfiguracja Aplikacji**

### 3.1 Zmienne Środowiskowe
Utwórz plik `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Dostępne Strony
- 🔓 **Publiczne**: `/login`, `/register`, `/forgot-password`
- 🔐 **Chronione**: wszystkie inne (`/`, `/users`, `/clients`, itp.)

---

## 🧪 **Krok 4: Testowanie Systemu**

### 4.1 Test Rejestracji
1. Uruchom aplikację: `pnpm dev`
2. Idź do http://localhost:3000
3. Zostaniesz przekierowany na `/login`
4. Kliknij "Zarejestruj się"
5. Wypełnij formularz i sprawdź email

### 4.2 Test Logowania
1. Potwierdź email (jeśli włączone)
2. Zaloguj się na `/login`
3. Zostaniesz przekierowany na dashboard

### 4.3 Test Wylogowania
1. Kliknij "Wyloguj" w sidebarze
2. Zostaniesz przekierowany na `/login`

---

## 🛡️ **Krok 5: Konfiguracja RLS (Row Level Security)**

### 5.1 Podstawowa Konfiguracja (Zalecana)
```sql
-- Wyłącz RLS dla szybkiego testowania
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### 5.2 Zaawansowana Konfiguracja (Produkcja)
```sql
-- Włącz RLS z politykami z Kroku 2.2
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

---

## 🎭 **Role Użytkowników**

### Dostępne Role:
- **`boss`**: Pełny dostęp (szef, właściciel)
- **`project_manager`**: Zarządzanie projektami i użytkownikami  
- **`junior_manager`**: Ograniczone zarządzanie
- **`therapist`**: Terapeuta z dostępem do klientów
- **`junior_therapist`**: Junior terapeuta z podstawowym dostępem

### Sidebar Navigation:
- **Boss**: Dashboard, Users, AI Bot, Activity Logs, Clients, Calendar, Courses
- **Project Manager**: Dashboard, Clients, Calendar, Courses
- **Junior Manager**: Dashboard, Clients, Calendar
- **Therapist**: Dashboard, Clients, Calendar
- **Junior Therapist**: Dashboard, Calendar

---

## 🐛 **Rozwiązywanie Problemów**

### Problem: "Nie można zalogować się"
1. Sprawdź czy email został potwierdzony
2. Sprawdź czy RLS nie blokuje dostępu:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```

### Problem: "Cannot find user profile"
1. Sprawdź czy trigger działa poprawnie
2. Sprawdź tabele `auth.users` i `public.users`:
   ```sql
   SELECT * FROM auth.users;
   SELECT * FROM public.users;
   ```

### Problem: "Błędy przekierowań"
1. Wyczyść cache przeglądarki
2. Sprawdź czy wszystkie ścieżki są poprawne w `components/auth-guard.tsx`

### Problem: "RLS Policy Error"
```sql
-- Tymczasowo wyłącz RLS na wszystkich tabelach
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
```

---

## 🔧 **Dostosowanie**

### Dodanie Nowych Ról:
1. Zaktualizuj typ w `lib/supabase.ts`:
   ```typescript
   role: 'boss' | 'custom_role' | 'therapist' | 'junior_therapist'
   ```

2. Dodaj navigation w `components/app-sidebar.tsx`:
   ```typescript
   custom_role: [
     // ... navigation items
   ]
   ```

### Zmiana Domyślnej Roli:
W funkcji `handle_new_user()` zmień:
```sql
COALESCE(NEW.raw_user_meta_data->>'role', 'therapist')::text,
-- na
COALESCE(NEW.raw_user_meta_data->>'role', 'custom_default')::text,
```

---

## 📧 **Email Configuration**

### Dla Development:
- Email confirmations można wyłączyć w Supabase Dashboard
- Reset password będzie działać przez Supabase

### Dla Production:
- Skonfiguruj custom SMTP w Supabase Settings
- Ustaw custom redirect URLs
- Dodaj domenę do Supabase allowed origins

---

## 🎯 **Checklist Wdrożenia**

- [ ] ✅ Projekt Supabase utworzony
- [ ] ✅ Email Auth włączona
- [ ] ✅ Zmienne `.env.local` ustawione
- [ ] ✅ SQL Schema wykonane  
- [ ] ✅ Trigger `handle_new_user()` utworzony
- [ ] ✅ Test rejestracji wykonany
- [ ] ✅ Test logowania wykonany
- [ ] ✅ RLS skonfigurowane (opcjonalnie)
- [ ] ✅ Aplikacja działa prawidłowo

**🎉 Gratulacje! System autentykacji jest gotowy do użycia!** 