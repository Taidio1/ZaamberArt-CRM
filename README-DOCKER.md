# Docker Setup dla ZaamberArt CRM

## Wymagania
- Docker
- Docker Compose

## Szybkie uruchomienie

### 1. Klonowanie i przygotowanie
```bash
git clone <your-repo>
cd ZaamberArt-CRM
```

### 2. Konfiguracja zmiennych środowiskowych
Utwórz plik `.env` w głównym katalogu z PRAWDZIWYMI danymi z Twojego projektu Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_supabase_anon_key_tutaj
NODE_ENV=production
```

**WAŻNE:** Te zmienne są wymagane zarówno podczas budowania (build time) jak i uruchamiania aplikacji!

### 3. Uruchomienie z Docker Compose
```bash
docker-compose up -d
```

Aplikacja będzie dostępna pod adresem: http://localhost:3001

## Alternatywne metody uruchomienia

### Budowanie i uruchamianie obrazu Docker bezpośrednio
```bash
# Budowanie obrazu z argumentami build-time
docker build -t zaamberart-crm \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_anon_key \
  .

# Uruchamianie kontenera
docker run -p 3001:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_anon_key \
  zaamberart-crm
```

### Development z Docker
Dla development możesz użyć volume do synchronizacji zmian:
```bash
docker run -p 3001:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NEXT_PUBLIC_SUPABASE_URL=your_supabase_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key \
  zaamberart-crm
```

## Przydatne komendy

### Zatrzymanie aplikacji
```bash
docker-compose down
```

### Sprawdzenie logów
```bash
docker-compose logs -f zaamberart-crm
```

### Rebuild obrazu po zmianach
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Usunięcie wszystkich kontenerów i obrazów
```bash
docker-compose down --rmi all --volumes --remove-orphans
```

## Troubleshooting

### Problem: "supabaseUrl is required" podczas budowania
**Błąd:** `Error: supabaseUrl is required.` w trakcie `pnpm build`

**Przyczyna:** Zmienne środowiskowe Supabase są potrzebne już podczas budowania aplikacji.

**Rozwiązanie:**
1. Utwórz plik `.env` z prawidłowymi danymi Supabase
2. Upewnij się, że używasz `docker-compose up` (nie `docker build` bezpośrednio)
3. Jeśli używasz `docker build`, dodaj argumenty:
```bash
docker build --build-arg NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_key .
```

### Problem z Next.js standalone build
Jeśli masz problemy z uruchomieniem, sprawdź czy w `next.config.mjs` jest ustawione:
```javascript
output: 'standalone'
```

### Problem z zmiennymi środowiskowymi
Upewnij się, że wszystkie wymagane zmienne środowiskowe są ustawione w pliku `.env` lub przekazane do kontenera.

### Problem z PNPM
Jeśli chcesz użyć npm zamiast pnpm, zmień w Dockerfile:
- `RUN npm install -g pnpm` → usuń tę linię
- `RUN pnpm install --frozen-lockfile` → `RUN npm ci`
- `RUN pnpm build` → `RUN npm run build`
- Dodaj `COPY package-lock.json ./` po `COPY package.json`

## Konfiguracja Supabase

Pamiętaj o skonfigurowaniu:
1. Supabase URL w zmiennych środowiskowych
2. Supabase Anon Key
3. Odpowiednie polityki RLS w bazie danych
4. CORS settings w Supabase dla Twojej domeny Docker

## Konfiguracja na serwerze z subdomeną

### 1. Uruchomienie na serwerze
```bash
# Skopiuj projekt na serwer
scp -r ZaamberArt-CRM/ user@your-server:/root/

# Zaloguj się na serwer
ssh user@your-server

# Przejdź do katalogu projektu
cd /root/ZaamberArt-CRM

# Uruchom aplikację
docker-compose up -d
```

### 2. Konfiguracja Nginx (reverse proxy)
Skopiuj plik `nginx.conf` do `/etc/nginx/sites-available/`:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/zaamberart-crm
sudo ln -s /etc/nginx/sites-available/zaamberart-crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Dodanie subdomeny w DNS
W panelu domeny dodaj rekord A:
```
crm.twoja-domena.pl -> IP_TWOJEGO_SERWERA
```

### 4. Sprawdzenie czy działa
```bash
# Sprawdź kontenery
docker ps

# Sprawdź logi aplikacji
docker-compose logs -f zaamberart-crm

# Test subdomeny
curl -I http://crm.twoja-domena.pl
```

## Produkcja

Dla produkcji rozważ:
1. Użycie wieloetapowego build dla optymalizacji
2. Konfigurację reverse proxy (nginx) ✅ **ZROBIONE**
3. SSL certificates (Let's Encrypt)
4. Health checks
5. Monitoring i logging 