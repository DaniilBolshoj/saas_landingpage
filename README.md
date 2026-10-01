# Pavyzdys – SaaS svetainės šablonas

Lietuviškas, statinis B2B SaaS nukreipimo puslapis be JavaScript karkasų, ikonų ar šriftų CDN.

## Failų struktūra

- `index.html` – lietuviškas projektų / užduočių valdymo koncepcijos puslapis, naudojimo pavyzdžiai ir interaktyvi lokali demonstracija.
- `access.html` – prieigos užklausos forma ir aiškus pranešimas, kad registracijos / prisijungimo sistemos nėra.
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
- `AI-DISCLOSURE.md` – informacija apie generatyvinio DI naudojimą rengiant kodą ir tekstus.
- `CHANGELOG.md` – šablono versijos pastabos.

## Paleidimas

Svetainė veikia kaip statiniai failai; kūrimo žingsnio nereikia. Patogiam testavimui iš šio katalogo paleiskite:

```sh
python3 -m http.server 8000
```

Atverkite `http://localhost:8000`. Kontaktų ir prieigos užklausų formos be `site-config.js` nurodyto serverio endpointo nieko nesiunčia ir aiškiai praneša apie demonstracinį režimą. Paskyrų kūrimo ar prisijungimo backend nėra. Interaktyvi demonstracija veikia tik naršyklėje ir nekeičia serverio duomenų.

## Pritaikymas

1. `site-config.js` pakeiskite prekės ženklo pavadinimą, domeną, el. paštą ir `themeStorageKey`. „Pavyzdys“ ir rezervuotas `.example` domenas yra tik demonstraciniai; „Pavyzdys“ nėra patikrintas prekių ženklų registruose.
2. `og:url` ir canonical reikšmes `index.html`, taip pat domeną `sitemap.xml` ir `robots.txt` atnaujinkite produkcijai.
3. `style.css` pradžioje keiskite `--color-primary`, teksto, paviršiaus ir ribų tokenus. Tamsios temos primary išvedamas iš to paties pagrindinio tokeno; pakeitę spalvas, dar kartą patikrinkite kontrastą. `assets/favicon.svg` ir `assets/og-cover.svg` spalvos redaguojamos atskirai.
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
- Pridėkite `AI-DISCLOSURE.md` prie perdavimo dokumentų ir užpildykite `LICENSE-TEMPLATE.md` tik po teisininko peržiūros.