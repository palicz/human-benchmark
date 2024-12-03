# System Plan – Human Benchmark Platform

## Technológiai Stack
- **Frontend:**
  - **Next.js**: Server-side rendering (SSR) és statikus oldalak generálása a React alapú felhasználói felülethez.
  - **React**: Felhasználói interakciók kezelésére és dinamikus UI komponensek létrehozására.
  - **shadcn/ui**: UI komponens könyvtár, amely segít a felhasználói felület gyors fejlesztésében, modern dizájnnal.
  - **TypeScript**: A frontend és backend kód típusellenőrzésére, hogy biztosítsuk a kód minőségét és megbízhatóságát.
  
- **Backend:**
  - **NeonDB**: Felhőalapú PostgreSQL adatbázis, amely gyors, skálázható adatkezelést biztosít.
  - **Prisma**: ORM (Object-Relational Mapping) eszköz a NeonDB adatbázishoz való kapcsolódáshoz és a modellek kezeléséhez.
  - **Next.js API Routes**: API végpontok létrehozása az adatkezeléshez (pl. bejelentkezés, teszt eredmények kezelése, ranglista frissítése).
  
- **Adatbázis**:
  - **PostgreSQL**: Relációs adatbázis a felhasználói adatok, teszt eredmények és ranglista tárolására.

## Architektúra

### 1. **Frontend Komponensek**:
- **React komponens struktúra**:
  - **Pages**:
    - `/auth/login`: Bejelentkezési oldal (Google, GitHub, email).
    - `/auth/register`: Regisztrációs oldal.
    - `/auth/reset`: Elfelejtett jelszó oldala.
    - `/settings`: A felhasználó profiloldala, ahol megtekinthetők az eredmények.
    - `/`: Főoldal, ahol a felhasználók a Memory, Aim, Number Memory és Typing Speed teszteket végezhetik el.
    - `/scoreboard`: Ranglista oldal, ahol a felhasználók láthatják a legjobb eredményeket.
    - `/admin`: Az admin felület.
  
  - **UI komponensek**:
    - **Header**: Navigációs menü (Login, Register, Profile, Scoreboard).
    - **Test**: Egyéni teszt felület, minden teszthez külön UI komponens.
    - **Button**, **Input**: Shadcn/UI által biztosított UI elemek.
    - **Scoreboard**: A ranglistát megjelenítő komponens, amely a teszt eredményeket tartalmazza.

### 2. **Backend Komponensek**:
- **API végpontok**:
  - **POST /api/auth/login**: Bejelentkezés, Google/GitHub/Email autentikáció.
  - **POST /api/auth/register**: Regisztráció új felhasználóknak.
  - **GET /api/profile**: Profil adatainak lekérése.
  - **POST /api/tests**: Teszt eredményének mentése.
  - **GET /api/scoreboard**: Ranglista lekérése.
  
  Az API végpontok Next.js API Routes segítségével vannak megvalósítva.

### 3. **Adatbázis Struktúra**:

- **Felhasználói tábla (`users`)**:
  - `id`: Egyedi azonosító (CUID típus).
  - `name`: Felhasználó neve.
  - `email`: Felhasználó email címe (egyedi).
  - `emailVerified`: A felhasználó email címe megerősítve.
  - `image`: Felhasználó profilképe.
  - `password`: Jelszó.
  - `role`: Felhasználó szerepe (ADMIN, USER), alapértelmezetten USER.
  - **Kapcsolódó entitás**: **Account** (bejelentkezési adatok).
  
- **Teszt eredmények tábla (`test_results`)**:
  - `id`: Egyedi azonosító.
  - `userId`: Kapcsolódás a felhasználóhoz.
  - `testType`: A teszt típusa (pl. Typing Speed, Memory Test).
  - `score`: Teszt eredménye.
  - `createdAt`: Eredmény rögzítésének ideje.

- **Ranglista tábla (`leaderboard`)**:
  - `id`: Egyedi azonosító.
  - `testType`: A teszt típusa.
  - `userId`: A legjobb felhasználó ID-ja.
  - `score`: Legjobb eredmény.
  - `updatedAt`: Ranglista frissítésének ideje.

- **Scoreboard tábla (`scoreboard`)**:
  - `id`: Egyedi azonosító.
  - `playerName`: A játékos neve (egyedi).
  - `score`: Teszt eredmény.
  - `aimScore`: Célpont találati eredmény.
  - `typeScore`: Típusos teszt eredmény.
  - `createdAt`: Eredmény rögzítésének ideje.

- **Account tábla (`accounts`)**:
  - `id`: Egyedi azonosító.
  - `userId`: A felhasználó ID-ja (kapcsolódás a `users` táblához).
  - `type`: Bejelentkezési típus (pl. Google, GitHub).
  - `provider`: A bejelentkezési szolgáltató neve.
  - `providerAccountId`: A szolgáltató egyedi fiók azonosítója.
  - **Kapcsolódó entitás**: **User** (a felhasználó adataihoz kapcsolódik).

- **VerificationToken tábla (`verificationtoken`)**:
  - `id`: Egyedi azonosító.
  - `email`: A felhasználó email címe.
  - `token`: A megerősítő token.
  - `expires`: A token lejárati ideje.

- **PasswordResetToken tábla (`passwordresettoken`)**:
  - `id`: Egyedi azonosító.
  - `email`: A felhasználó email címe.
  - `token`: A jelszó visszaállító token.
  - `expires`: A token lejárati ideje.

### 4. **Funkciók és Felhasználói Forgatókönyvek**:

- **Felhasználói regisztráció és bejelentkezés**:
  - A felhasználó regisztrálhat Google/GitHub/Email fiókkal.
  - Bejelentkezés után a felhasználó hozzáférhet a profil oldalához és tesztelhet.

- **Tesztelési funkcionalitás**:
  - A felhasználó kiválaszthatja és elvégezheti a Memory Test, Number Memory Test, Aim Training, Typing Speed Test teszteket.
  - Az eredmények automatikusan mentésre kerülnek az adatbázisba.

- **Ranglista megjelenítése**:
  - A felhasználók böngészhetik az összes teszt legjobb eredményeit a ranglistán.

- **Admin funkciók**:
  - Az adminisztrátorok láthatják a felhasználói adatokat.
  
### 5. **Technológiai Integráció**:
- **Prisma ORM**: Az adatbázis kapcsolódás és az entitások közötti kapcsolat kezelésére.
- **NeonDB**: PostgreSQL alapú adatbázis felhőben való tárolás.
- **TypeScript**: A kód típusellenőrzése, hogy megbízhatóbbá tegyük a fejlesztést.
- **shadcn/ui**: Modern UI komponens könyvtár, amely gyors fejlesztést biztosít.

## Fejlesztési és Deploy Stratégiák
1. **Fejlesztési környezet**:
   - Lokálisan Next.js szerver futtatása a fejlesztéshez.
   - A fejlesztés előtt mindig teszteljük a Prisma migrációkat és az adatbázis módosításokat.

2. **Deploy**:
   - **Frontend**: Vercel, ahol a Next.js alkalmazás egyszerűen deployolható.
   - **Backend**: Az API-k a Next.js-en keresztül futnak, így nincs külön backend szerver, az API Route-ok közvetlenül a Next.js alkalmazás részeként működnek.
   - **Adatbázis**: NeonDB, amely felhőszolgáltatásként biztosítja a PostgreSQL adatbázisunkat.
