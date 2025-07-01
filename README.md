---

# 📌 Cel aplikacji

Aplikacja ma na celu umożliwienie właścicielowi firmy (szefowej) kompleksowego zarządzania działalnością związaną z hipnoterapią, sprzedażą szkoleń oraz kontaktami z klientami. System obsługuje wiele ról i modułów, automatyzuje komunikację, wspiera analizy i integruje się z zewnętrznymi systemami (np. Google Calendar, media społecznościowe).

---

## 👤 Główne Role i Uprawnienia

| Rola | Uprawnienia |
| --- | --- |
| **Szefowa** | Pełny dostęp do wszystkich funkcji systemu |
| **Pracownik** | Dostęp do przypisanych klientów, terminarza i wiadomości |
| **Hipnoterapeuta** | Dostęp do własnych klientów i kontaktów, możliwość konsultacji online |
| **Klient** | Możliwość kontaktu z wybranym hipnoterapeutą po zalogowaniu |

---

## 🧩 Moduły Systemu

### 1. 🧑‍💼 Zarządzanie Pracownikami

- Tworzenie i edytowanie profili pracowników
- Przypisywanie klientów do pracowników
- Monitorowanie wyników i efektywności pracy

### 2. 🧘‍♂️ Zarządzanie Hipnoterapeutami (Podopiecznymi)

- Dodawanie hipnoterapeutów do systemu
- Klient po zalogowaniu może się z nimi skontaktować
- 20% prowizji z każdej transakcji trafia do szefa (automatyzacja obliczeń)

### 3. 🤖 Bot AI do Social Media

- Analiza i podsumowanie wiadomości z social media (Facebook, Instagram, itp.)
- Tabela z historią wiadomości i czasem odpowiedzi
- Możliwość przerwania konwersacji przez szefa
- Opcja ręcznego przejęcia konwersacji

### 4. 👥 Zarządzanie Klientami Indywidualnymi

- Przegląd wszystkich klientów w systemie
- Możliwość filtrowania po statusie, przypisaniu, etapie terapii

### 5. 📆 Kalendarz (Integracja z Google Calendar)

- Synchronizacja terminów spotkań pracowników i hipnoterapeutów
- Widok dzienny / tygodniowy / miesięczny
- Powiadomienia i przypomnienia

### 6. 🎓 Sprzedaż Szkoleń

- Moduł zarządzania szkoleniami
- Lista dostępnych kursów (np. Kurs Hipnoterapii)
- Statystyki sprzedaży i raporty

---

## 🔐 Bezpieczeństwo

- Logowanie z rolą i poziomem dostępu
- Dwuskładnikowe uwierzytelnianie (opcjonalne)
- Zabezpieczenie danych klientów zgodnie z RODO

---

## 📊 Panel Szefa (Dashboard)

- Widok ogólny: liczba klientów, liczba sesji, sprzedaż kursów
- Procentowa prowizja z usług hipnoterapeutów
- Aktywność AI bota (ilość rozmów, przejęcia, skuteczność)

---

## 🔧 Technologie i Architektura (do doprecyzowania)

- Frontend: React / Next.js
- Backend: Node.js / Python
- Baza danych: Supabase
- Integracje: Google Calendar API, Facebook Graph API, Instagram API, AI Chatbot (np. OpenAI, Dialogflow)