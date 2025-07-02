# Używamy oficjalnego obrazu Node.js jako base image
FROM node:20-alpine AS base

# Instalujemy pnpm
RUN npm install -g pnpm

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy pliki package.json i pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Etap 1: Instalacja dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Etap 2: Build aplikacji
FROM base AS builder

# Argumenty dla zmiennych środowiskowych potrzebnych w build time
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Ustawiamy zmienne środowiskowe dla build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Budujemy aplikację
RUN pnpm build

# Etap 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Tworzymy nieprivilegowanego użytkownika
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiujemy niezbędne pliki
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ustawiamy właściciela plików
RUN chown -R nextjs:nodejs /app
USER nextjs

# Ekspozycja portu
EXPOSE 3000

# Zmienna środowiskowa dla portu
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Uruchamiamy aplikację
CMD ["node", "server.js"] 