# 🗄️ Konfiguracja Bazy Danych - HynoCRM

## 📋 Dostępne Wersje Schema

W projekcie dostępne są dwie wersje schema bazy danych:

### 1. 🚀 **supabase-schema.sql** (Podstawowa wersja)
- **Przeznaczenie**: Szybki start i testowanie funkcji zarządzania użytkownikami
- **Zakres**: Podstawowe tabele dla działającej aplikacji
- **Tabele**: `users`, `work_sessions`, `clients`, `activity_logs`
- **Rekomendacja**: **Użyj tej wersji do uruchomienia aplikacji**

### 2. 🏢 **supabase-complete-schema.sql** (Kompletna architektura)
- **Przeznaczenie**: Pełna implementacja systemu CRM bazująca na `przyklad_architektury.txt`
- **Zakres**: Wszystkie funkcjonalności centrum hipnoterapii
- **Tabele**: 10 tabel z pełną funkcjonalnością biznesową
- **Rekomendacja**: Użyj gdy potrzebujesz pełnego systemu CRM

---

## 🎯 **ZALECANA IMPLEMENTACJA**

### Krok 1: Uruchom Podstawową Wersję
```sql
-- Wykonaj w Supabase SQL Editor
-- PLIK: supabase-schema.sql
```

**Dlaczego zacząć od podstawowej wersji?**
- ✅ Aplikacja `/users` od razu działa
- ✅ Łatwiejsze debugowanie
- ✅ Szybkie sprawdzenie konfiguracji
- ✅ Testowanie połączenia z Supabase

### Krok 2: Upgrade do Pełnej Wersji (opcjonalnie)
```sql
-- Jeśli potrzebujesz pełnej funkcjonalności
-- PLIK: supabase-complete-schema.sql
```

---

## 🔧 **Instrukcja Wdrożenia**

### 🚀 **Opcja A: Podstawowa (ZALECANA)**

1. **Utwórz projekt w Supabase**
   ```
   - Nazwa: HynoCRM
   - Region: Europe-West
   - Hasło: ustaw swoje
   ```

2. **Skopiuj dane połączenia**
   ```bash
   # Settings > API
   Project URL: https://xxx.supabase.co
   anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Utwórz .env.local**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Wykonaj SQL Schema**
   ```sql
   -- W Supabase SQL Editor wykonaj CAŁOŚĆ z pliku:
   -- supabase-schema.sql
   ```

5. **Uruchom aplikację**
   ```bash
   pnpm dev
   # Idź do http://localhost:3000/users
   ```

### 🏢 **Opcja B: Kompletna Architektura**

1. **Wykonaj kroki 1-3 z Opcji A**

2. **Wykonaj kompletne SQL Schema**
   ```sql
   -- W Supabase SQL Editor wykonaj CAŁOŚĆ z pliku:
   -- supabase-complete-schema.sql
   ```

3. **Zaktualizuj lib/supabase.ts**
   - Dodaj nowe typy interfejsów
   - Dodaj funkcje dla nowych tabel

---

## 📊 **Porównanie Wersji**

| Funkcjonalność | Podstawowa | Kompletna |
|----------------|------------|-----------|
| Zarządzanie użytkownikami | ✅ | ✅ |
| Statystyki godzin pracy | ✅ | ✅ |
| Relacje terapeuta-klient | ❌ | ✅ |
| System prowizji | ❌ | ✅ |
| Bot AI logs | ❌ | ✅ |
| Integracja kalendarz | ❌ | ✅ |
| System szkoleń | ❌ | ✅ |
| Zaawansowane RLS | ❌ | ✅ |
| Activity logging | Podstawowy | Zaawansowany |
| Funkcje PostgreSQL | Podstawowe | Zaawansowane |

---

## 🔒 **Bezpieczeństwo (RLS)**

### Podstawowa wersja:
- Otwarte polityki dla szybkiego testowania
- Możliwość łatwego wyłączenia RLS

### Kompletna wersja:
- Pełne Row Level Security
- Role-based access control
- Szczegółowe polityki dostępu

---

## 📝 **Przykładowe Dane**

Obie wersje zawierają przykładowe dane testowe:

### Użytkownicy:
- **Jan Kowalski** (boss) - admin@hipnoterapia.pl
- **Maria Nowak** (therapist) - maria.nowak@hipnoterapia.pl  
- **Piotr Wiśniewski** (therapist) - piotr.wisniewski@hipnoterapia.pl
- **Anna Kowalczyk** (employee/junior_therapist) - anna.kowalczyk@hipnoterapia.pl

### Klienci:
- Katarzyna Dąbrowska
- Michał Zieliński 
- Agnieszka Szymańska
- Robert Woźniak

---

## 🐛 **Rozwiązywanie Problemów**

### Problem: "Cannot find module Supabase"
```bash
# Sprawdź czy masz zmienne środowiskowe
cat .env.local

# Restart serwera
pnpm dev
```

### Problem: RLS blokuje dostęp
```sql
-- Tymczasowo wyłącz RLS na tabeli users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Problem: Błędy w SQL
- Wykonuj schema po kolei (linia po linii w razie problemów)
- Sprawdź czy wszystkie rozszerzenia są włączone
- Sprawdź logi w Supabase Dashboard

---

## 🚀 **Następne Kroki Po Wdrożeniu**

1. **Testowanie podstawowych funkcji**
   - Dodaj nowego użytkownika
   - Edytuj istniejącego
   - Sprawdź statystyki

2. **Konfiguracja produkcyjna**
   - Ustaw właściwe polityki RLS
   - Skonfiguruj backup
   - Ustaw monitorowanie

3. **Rozwój aplikacji**
   - Dodaj autentykację
   - Implementuj pozostałe sekcje
   - Dodaj testy

---

## 📞 **Wsparcie**

- **Podstawowe problemy**: Sprawdź logi w konsoli przeglądarki
- **Problemy z bazą**: Sprawdź Supabase Dashboard > Logs
- **Problemy z RLS**: Tymczasowo wyłącz RLS na problematycznych tabelach

---

## 🎯 **Rekomendacje**

✅ **Zacznij od podstawowej wersji** - szybki start i działająca aplikacja  
✅ **Przetestuj funkcjonalności** - dodawanie/edycja użytkowników  
✅ **Przejdź na kompletną** - gdy potrzebujesz więcej funkcji  
✅ **Dostosuj do potrzeb** - dodaj własne tabele i pola 