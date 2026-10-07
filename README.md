# Kainų Sargas – kuriamas kainų stebėjimo įrankis

Lietuviškas statinis puslapis apie kuriamą įrankį, skirtą prekių kainoms Lietuvos internetinėse parduotuvėse stebėti. Šiuo metu veikia tik paskyros: registracija, prisijungimas ir slaptažodžio atkūrimas. Kainų stebėjimo funkcijos dar kuriamos.

## Failų struktūra

- `index.html` – produkto aprašas, planuojamos galimybės, paskyrų informacija, DUK ir kontaktų forma.
- `register.html`, `login.html`, `forgot-password.html`, `reset-password.html` – paskyrų srautai.
- `dashboard.html` – prisijungusios paskyros puslapis; jo JavaScript patikra yra tik patogumas, o tikrą duomenų apsaugą užtikrina lentelių RLS politika.
- `auth.js` ir `assets/vendor/supabase.js` – bendras autentifikacijos modulis ir vietoje saugomas Supabase JS v2 klientas.
- `supabase/schema.sql` – profilių lentelės RLS politika ir automatinio profilio kūrimo trigeris.
- `style.css` – išdėstymas, temos, piktogramos ir CSS spalvų tokenai.
- `script.js` – temos pasirinkimas, navigacija ir kontaktų forma.
- `site-config.js` – vienintelė prekės ženklo, domeno, el. pašto, temos rakto ir formos endpointo konfigūracijos vieta.
- `theme-init.js` – parenka išsaugotą arba OS temą prieš įkeliant CSS.
- `about.html` – trumpas projekto pristatymas; `privacy.html` ir `terms.html` – dar pritaikytini teisinių tekstų ruošiniai; `404.html` – klaidos puslapis.
- `assets/fonts/` – vietiniai „DejaVu Sans“ šriftai ir jų licencija.
- `assets/favicon.svg` – svetainės favicon.
- `robots.txt`, `sitemap.xml` – paieškos sistemų metaduomenų pavyzdžiai.
- `THIRD-PARTY.md` – supakuotų išorinių išteklių kilmė ir licencija.
- `LICENSE-TEMPLATE.md` – sutarties ruošinys; tai nėra individuali teisinė konsultacija.
- `RIGHTS-TRANSFER-CHECKLIST.md` – versijos, turto grandinės ir galimo teisių perleidimo kontrolinis sąrašas.
- `CHANGELOG.md` – projekto versijos pastabos.

## Paleidimas

Svetainė veikia kaip statiniai failai; kūrimo žingsnio nereikia. Patogiam testavimui iš šio katalogo paleiskite:

```sh
python3 -m http.server 8000
```

Atverkite `http://localhost:8000`. Kontaktų forma be `site-config.js` nurodyto serverio endpointo nieko nesiunčia ir aiškiai praneša apie demonstracinį režimą.

## Paskyrų paleidimas

1. Sukurkite „Supabase“ projektą ES regione ir įjunkite el. pašto autentifikaciją.
2. Projekto API nustatymuose nukopijuokite projekto URL ir viešą „anon“ raktą į `supabaseUrl` ir `supabaseAnonKey` faile `site-config.js`. Šie laukai pradžioje tušti; naršyklėje naudokite tik viešą raktą.
3. Niekada nedėkite `service_role` rakto ar kitos paslapties į šį repo ar naršyklės kodą. `service_role` apeina RLS ir yra skirtas tik saugiai serverio pusei.
4. Supabase SQL Editor paleiskite `supabase/schema.sql`, kad sukurtumėte profilių lentelę, jos RLS taisykles ir naudotojo sukūrimo trigerį.
5. Supabase Auth URL konfigūracijoje nurodykite svetainės URL ir leistinus grįžimo adresus, įskaitant `dashboard.html` bei `reset-password.html`. Vietiniam bandymui naudokite, pavyzdžiui, `http://localhost:8000`, ne `file://`.
6. Patvirtinimo ir slaptažodžio atkūrimo PKCE nuorodą atidarykite tame pačiame naršyklės profilyje, kuriame pradėjote veiksmą, nes PKCE kodui iškeisti reikalingas ten išsaugotas verifier.

`dashboard.html` JavaScript nukreipimas tėra patogumas, o ne duomenų apsauga. Visoms tikroms naudotojų lentelėms būtina įjungti ir patikrinti RLS; niekada nepasikliaukite vien puslapio paslėpimu ar kliento kodu.

## Pritaikymas

1. `site-config.js` pakeiskite prekės ženklo pavadinimą, domeną, el. paštą ir `themeStorageKey`; paskyroms nustatykite `supabaseUrl` bei viešą `supabaseAnonKey`. „Kainų Sargas“ yra laikinas pavadinimas, o `.example` domenas ir el. paštas – rezervuoti pavyzdžiai, nepublikuokite jų kaip tikrų kontaktų.
2. `og:url` ir canonical reikšmes redaguokite tiesiogiai `index.html` produkcinėms vertėms, nes socialiniai robotai JavaScript neįvykdo. Puslapio pavadinimas ir aprašymai taip pat turi būti atnaujinti statiniame HTML.
3. `style.css` pradžioje keiskite `--color-primary`, teksto, paviršiaus ir ribų tokenus. Tamsios temos primary išvedamas iš to paties pagrindinio tokeno; pakeitę spalvas, dar kartą patikrinkite kontrastą. `assets/favicon.svg` ir `assets/og-cover.svg` spalvos redaguojamos atskirai. Produkcijai sugeneruokite `assets/og-cover.png` ir `assets/favicon-180.png`, jei reikia socialinių kortelių ir Apple ikonos.
4. `--font-body` ir `--font-display` tokenai parenka vietinius „DejaVu Sans“ failus. Keisdami šriftą atnaujinkite `assets/fonts/` ir `THIRD-PARTY.md`.
5. Skelbkite tik patvirtintą produkto informaciją. Kainų stebėjimo funkcijos dar kuriamos, o paslaugos kainodara dar sprendžiama.
6. Formai įrašykite HTTPS `formEndpoint` reikšmę `site-config.js`. Endpointas turi priimti `POST` su `FormData` ir `Accept: application/json` antrašte. Serveris turi tikrinti honeypot lauką, validuoti įvestis ir riboti užklausas. Naršyklės validacija nepakeičia serverio saugumo ar BDAR atitikties.
7. Prieš publikuodami nustatykite kainų PVM statusą, bandymo ir mokėjimo sąlygas bei duomenų saugojimą. Kainodara dar sprendžiama; nenurodykite nepatvirtintų planų ar funkcijų.
8. Privatumo, sąlygų ir licencijos puslapius pritaikykite faktiniam duomenų tvarkymui ir pardavimo modeliui; prieš publikuodami gaukite teisininko peržiūrą.

## Išleidimo patikra

- Patikrinkite klaviatūros navigaciją, fokusą, tamsios temos kontrastą ir mobilų meniu.
- Patikrinkite formą su tikru endpointu; numatytoji `.example` konfigūracija laiškų nesiunčia.
- Įsitikinkite, kad `robots.txt`, canonical nuoroda ir `sitemap.xml` nurodo produkcinį domeną.
- Patikrinkite, ar pirkėjui perduodama šio paketo licencija, trečiųjų šalių sąrašas ir reikiamos pradinės sutarties sąlygos.