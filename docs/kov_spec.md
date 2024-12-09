# BrainGames
# Követelményspecifikáció

## 1. Áttekintés
A BrainGames egy modern webalkalmazás, amely különböző kognitív képességek tesztelésére és fejlesztésére szolgál. A platform lehetővé teszi a felhasználók számára, hogy felmérjék és összehasonlítsák teljesítményüket különböző területeken, mint például memória, reakcióidő, célzási készség és gépelési sebesség.

A rendszer hat fő tesztkategóriát tartalmaz:
- Memory Test: A vizuális memória és mintafelismerés tesztelése
- Number Memory Test: Számsorok megjegyzésének képességének mérése
- Aim Training: Célzási pontosság és gyorsaság fejlesztése
- Typing Speed Test: Gépelési sebesség és pontosság mérése
- Reaction Time Test: Reakcióidő tesztelése
- Stroop Test: Kognitív rugalmasság és színfelismerés tesztelése

A felhasználók regisztrálhatnak és bejelentkezhetnek Google-, GitHub- vagy email-fiókkal, hogy nyomon követhessék fejlődésüket és összehasonlíthassák eredményeiket másokkal egy globális ranglistán. Az alkalmazás modern technológiákat használ, mint például React és Next.js a frontend oldalon, valamint NeonDB és Prisma a backend adatkezeléshez, biztosítva a gyors és megbízható működést.


## 2. Jelenlegi helyzet
Jelenleg számos kognitív képességeket mérő alkalmazás létezik, de ezek gyakran szétszórtak, nem egységesek, és nem kínálnak átfogó megoldást. A felhasználóknak több különböző platformot kell használniuk, ha szeretnék tesztelni különböző képességeiket, és nehézkes az eredmények összehasonlítása vagy a fejlődés nyomon követése.

Szükség van egy modern, átfogó platformra, amely egyesíti a különböző kognitív teszteket, lehetővé teszi az eredmények követését és összehasonlítását, valamint motiváló környezetet teremt a fejlődéshez. A BrainGames ezt a hiányt kívánja betölteni egy korszerű, felhasználóbarát webalkalmazással.


## 3. Vágyálom rendszer
A BrainGames egy átfogó, modern webalkalmazás, amely a következő funkciókat és jellemzőket kínálja:

### Felhasználói Élmény
- Intuitív, felhasználóbarát felület modern dizájnnal
- Reszponzív megjelenítés minden eszközön (mobil, tablet, asztali)
- Egyszerű navigáció a különböző tesztek és funkciók között
- Személyre szabható felhasználói profil

### Tesztelési Rendszer
- Hat különböző kognitív képességet mérő teszt:
  - Memory Test: Vizuális minták megjegyzése és visszaidézése
  - Number Memory Test: Számsorok memorizálása növekvő nehézséggel
  - Aim Training: Precíziós célzás és reakcióidő fejlesztése
  - Typing Speed Test: Gépelési sebesség és pontosság mérése
  - Reaction Time Test: Egyszerű és összetett reakcióidő mérése
  - Stroop Test: Kognitív rugalmasság és interferencia tesztelése
- Részletes eredménykimutatás minden teszt után
- Fejlődési grafikonok és statisztikák

### Felhasználói Fiókok
- Többféle bejelentkezési opció (Google, GitHub, email)
- Biztonságos adatkezelés és felhasználói adatvédelem
- Személyes eredmények és statisztikák tárolása
- Profil testreszabási lehetőségek

### Közösségi Funkciók
- Globális ranglisták

### Adminisztrációs Felület
- Felhasználók kezelése
- Teszteredmények monitorozása
- Rendszerstatisztikák és jelentések
- Tartalom és beállítások menedzselése

### Technikai Jellemzők
- Gyors és megbízható működés
- Valós idejű adatfrissítés
- Biztonságos adattárolás és kezelés
- Skálázható architektúra


## 4. Igényelt üzleti folyamatok

### 4.1 Regisztráció és Bejelentkezés
- Felhasználói fiók létrehozása (Google, GitHub, vagy email)
- Biztonságos bejelentkezés
- Jelszó visszaállítási folyamat
- Profil testreszabása

### 4.2 Tesztelési Folyamatok
- Memory Test
  1. Vizuális minták megjelenítése
  2. Felhasználói input rögzítése
  3. Eredmény kiértékelése és mentése

- Number Memory Test
  1. Számsorok generálása növekvő nehézséggel
  2. Felhasználói válasz ellenőrzése
  3. Pontszám számítása és tárolása

- Aim Training
  1. Célpontok megjelenítése
  2. Kattintások pontosságának mérése
  3. Reakcióidő és pontosság értékelése

- Typing Speed Test
  1. Szöveg megjelenítése
  2. Gépelési sebesség és pontosság mérése
  3. WPM és pontosság számítása

- Reaction Time Test
  1. Vizuális inger megjelenítése
  2. Reakcióidő mérése
  3. Átlagos és legjobb idő számítása

- Stroop Test
  1. Színes szavak megjelenítése
  2. Válaszidő és pontosság mérése
  3. Interferencia hatás értékelése

### 4.3 Eredmények Kezelése
- Teszteredmények automatikus mentése
- Személyes statisztikák generálása
- Fejlődési grafikonok készítése
- Globális ranglisták frissítése

### 4.4 Adminisztrációs Folyamatok
- Felhasználók kezelése és moderálása
- Rendszerstatisztikák generálása
- Biztonsági mentések készítése
- Rendszerbeállítások konfigurálása


## 6. Követelménylista
| Modul | Követelmény | Prioritás | Státusz |
|-------|-------------|-----------|----------|
| Autentikáció | Google/GitHub/Email bejelentkezés | Magas | Kész |
| Autentikáció | Jelszó visszaállítás | Közepes | Kész |
| Autentikáció | Profil kezelés | Közepes | Kész |
| Memory Test | Vizuális minták megjelenítése és kiértékelése | Magas | Kész |
| Number Memory Test | Számsorok generálása és ellenőrzése | Magas | Kész |
| Aim Training | Célpontok és pontosság mérése | Magas | Kész |
| Typing Speed Test | Gépelési sebesség és pontosság mérése | Magas | Kész |
| Reaction Time Test | Reakcióidő mérése és kiértékelése | Magas | Kész |
| Stroop Test | Színes szavak és interferencia mérése | Magas | Kész |
| Eredménykezelés | Automatikus mentés és statisztikák | Közepes | Kész |
| Eredménykezelés | Ranglista rendszer | Közepes | Kész |
| Admin felület | Felhasználók kezelése | Alacsony | Kész |
| Admin felület | Rendszerstatisztikák | Alacsony | Kész |
| Biztonság | Adatvédelem és titkosítás | Magas | Kész |
| Teljesítmény | Gyors betöltési idő és válaszidő | Közepes | Kész |
