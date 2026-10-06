# Pavyzdys – SaaS svetainės šablonas

Lietuviškas, statinis B2B SaaS nukreipimo puslapis be JavaScript karkasų, ikonų ar šriftų CDN.

## Failų struktūra

- `index.html` – lietuviškas projektų / užduočių valdymo koncepcijos puslapis, naudojimo pavyzdžiai ir interaktyvi lokali demonstracija.
- `access.html` – prieigos užklausos forma ir nuoroda į paskyros registraciją.
- `register.html`, `login.html`, `forgot-password.html`, `reset-password.html` – Supabase Auth paskyros srautai.
- `dashboard.html` – prisijungusios paskyros puslapis; jo JavaScript patikra yra tik patogumas, o tikrą duomenų apsaugą užtikrina lentelių RLS politika.
- `auth.js` ir `assets/vendor/supabase.js` – bendras autentifikacijos modulis ir vietoje saugomas Supabase JS v2 klientas.
- `supabase/schema.sql` – profilių lentelės RLS politika ir automatinio profilio kūrimo trigeris.
- `style.css` – išdėstymas, temos, piktogramos ir CSS spalvų tokenai.
- `script.js` – temos pasirinkimas, meniu, modalas ir kontaktų forma.
- `site-config.js` – vienintelė prekės ženklo, domeno, el. pašto, temos rakto ir formos endpointo konfigūracijos vieta.
- `theme-init.js` – parenka išsaugotą arba OS temą prieš įkeliant CSS.
- `about.html`, `privacy.html`, `terms.html`, `404.html` – apie šabloną, teisinių tekstų ruošiniai ir klaidos puslapis.
- `assets/fonts/` – vietiniai „DejaVu Sans“ šriftai ir jų licencija.
- `assets/favicon.svg` – šiam šablonui sukurtas favicon.
- `robots.txt`, `sitemap.xml` – paieškos sistemų metaduomenų pavyzdžiai.
- `THIRD-PARTY.md` – supakuotų išorinių išteklių kilmė ir licencija.
- `LICENSE-TEMPLATE.md` – sutarties ruošinys; tai nėra individuali teisinė konsultacija.
- `RIGHTS-TRANSFER-CHECKLIST.md` – versijos, turto grandinės ir galimo teisių perleidimo kontrolinis sąrašas.
- `CHANGELOG.md` – šablono versijos pastabos.

## 1.0.1-draft – 2026-10-04

- Pašalinta demonstracinė registracija ir prisijungimas; šablone lieka tik prieigos užklausų forma.
- Išvalyti anksčiau saugoti demonstraciniai "saas-demo-users" ir "saas-demo-session" duomenys, kad jie neišliktų naršyklėje.

## Paleidimas

Svetainė veikia kaip statiniai failai; kūrimo žingsnio nereikia. Patogiam testavimui iš šio katalogo paleiskite:

```sh
python3 -m http.server 8000
```

Atverkite `http://localhost:8000`. Kontaktų ir prieigos užklausų formos be `site-config.js` nurodyto serverio endpointo nieko nesiunčia ir aiškiai praneša apie demonstracinį režimą. Interaktyvi demonstracija veikia tik naršyklėje ir nekeičia serverio duomenų.

## Paskyrų paleidimas

1. Sukurkite „Supabase“ projektą ES regione ir įjunkite el. pašto autentifikaciją.
2. Projekto API nustatymuose nukopijuokite projekto URL ir viešą „anon“ raktą į `supabaseUrl` ir `supabaseAnonKey` faile `site-config.js`. Šie laukai pradžioje tušti; naršyklėje naudokite tik viešą raktą.
3. Niekada nedėkite `service_role` rakto ar kitos paslapties į šį repo ar naršyklės kodą. `service_role` apeina RLS ir yra skirtas tik saugiai serverio pusei.
4. Supabase SQL Editor paleiskite `supabase/schema.sql`, kad sukurtumėte profilių lentelę, jos RLS taisykles ir naudotojo sukūrimo trigerį.
5. Supabase Auth URL konfigūracijoje nurodykite svetainės URL ir leistinus grįžimo adresus, įskaitant `dashboard.html` bei `reset-password.html`. Vietiniam bandymui naudokite, pavyzdžiui, `http://localhost:8000`, ne `file://`.
6. Patvirtinimo ir slaptažodžio atkūrimo PKCE nuorodą atidarykite tame pačiame naršyklės profilyje, kuriame pradėjote veiksmą, nes PKCE kodui iškeisti reikalingas ten išsaugotas verifier.

`dashboard.html` JavaScript nukreipimas tėra patogumas, o ne duomenų apsauga. Visoms tikroms naudotojų lentelėms būtina įjungti ir patikrinti RLS; niekada nepasikliaukite vien puslapio paslėpimu ar kliento kodu.

## Pritaikymas

1. `site-config.js` pakeiskite prekės ženklo pavadinimą, domeną, el. paštą ir `themeStorageKey`; paskyroms nustatykite `supabaseUrl` bei viešą `supabaseAnonKey`. „Pavyzdys“ ir rezervuotas `.example` domenas yra tik demonstraciniai; „Pavyzdys“ nėra patikrintas prekių ženklų registruose.
2. `og:url`, `og:image`, `twitter:image`, canonical ir `twitter:card` reikšmes redaguokite tiesiogiai `index.html` produkcinėms vertėms, nes socialiniai robotai JavaScript neįvykdo. `site-config.js` užpildytos vertės padeda naršyklėje veikiantiems rodiniams, bet HTML meta žymės turi būti atnaujintos ir čia, ne tik skripte.
3. `style.css` pradžioje keiskite `--color-primary`, teksto, paviršiaus ir ribų tokenus. Tamsios temos primary išvedamas iš to paties pagrindinio tokeno; pakeitę spalvas, dar kartą patikrinkite kontrastą. `assets/favicon.svg` ir `assets/og-cover.svg` spalvos redaguojamos atskirai. Produkcijai sugeneruokite `assets/og-cover.png` ir `assets/favicon-180.png`, jei reikia socialinių kortelių ir Apple ikonos.
4. `--font-body` ir `--font-display` tokenai parenka vietinius „DejaVu Sans“ failus. Keisdami šriftą atnaujinkite `assets/fonts/` ir `THIRD-PARTY.md`.
5. Pakeiskite pavyzdinius tekstus, planus, kainas ir naudojimo atvejus. Šablone nėra klientų atsiliepimų ar patvirtintų produkto rezultatų; palikite tik įrodymus, kuriuos galite pagrįsti.
6. Formai įrašykite HTTPS `formEndpoint` reikšmę `site-config.js`. Endpointas turi priimti `POST` su `FormData` ir `Accept: application/json` antrašte. Serveris turi tikrinti honeypot lauką, validuoti įvestis ir riboti užklausas. Naršyklės validacija nepakeičia serverio saugumo ar BDAR atitikties.
7. Prieš publikuodami nustatykite kainų PVM statusą, bandymo ir mokėjimo sąlygas, tikrą produkto funkcionalumą, integracijas bei duomenų saugojimą. Dabartiniai planai ir funkcijos yra pavyzdžiai, ne pasiūlymas pirkti.
8. Privatumo, sąlygų ir licencijos puslapius pritaikykite faktiniam duomenų tvarkymui ir pardavimo modeliui; prieš publikuodami gaukite teisininko peržiūrą.

## Išleidimo patikra

- Patikrinkite klaviatūros navigaciją, fokusą, tamsios temos kontrastą ir mobilų meniu.
- Patikrinkite formą su tikru endpointu; numatytoji `.example` konfigūracija laiškų nesiunčia.
- Įsitikinkite, kad `robots.txt`, canonical nuoroda ir `sitemap.xml` nurodo produkcinį domeną.
- Patikrinkite, ar pirkėjui perduodama šio paketo licencija, trečiųjų šalių sąrašas ir reikiamos pradinės sutarties sąlygos.