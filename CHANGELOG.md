# Pakeitimų žurnalas

## 1.0.2-draft – 2026-10-06

- Pridėti Supabase Auth registracijos, prisijungimo, slaptažodžio atkūrimo ir apsaugotos paskyros puslapiai su PKCE.
- Supabase JS v2.117.2 UMD biblioteka saugoma vietoje; vieša konfigūracija palikta tuščia, o `supabase/schema.sql` apibrėžia profilių RLS ir kūrimo trigerį.
- Viešoje navigacijoje paskyros būsena nustatoma tik kaip vietinės saugyklos UI užuomina; apsaugos ir paleidimo instrukcijos aprašytos README.
- Privatumo politikos duomenų aprašymas atnaujintas paskyros el. paštui, maišytam slaptažodžiui ir naršyklėje saugomai sesijai.

## 1.0.1-draft – 2026-10-05

- Pašalinta demonstracinė registracija ir prisijungimo sistema iš puslapio ir skriptų.
- Išvalyti anksčiau įrašyti demonstraciniai autentifikacijos duomenys naršyklės saugykloje.
- Prieigos puslapyje liko tik prieigos užklausos forma ir teisingas dokumentacijos aprašymas.
- Prieigos forma rodo lietuviškas laukų klaidas, atnaujina jas įvedant duomenis ir be endpointo pateikia demonstracinį pranešimą.
- Pridėtas lietuviškas simbolių skaičiaus linksniavimas; temos spalvos metaduomenims naudojamos HEX reikšmės, o socialinių kortelių skriptas naudoja PNG.
- Prieigos forma turi atsarginę instrukciją be JavaScript, funkcijų nuorodos turi ekrano skaitytuvams skirtus pavadinimus, pašalinti nenaudojami atsiliepimų ir hero įrodymų stiliai.
- Mobilios antraštės meniu ir temos valdikliai nustatyti 44 x 44 px, temos jungiklio tekstas mažame ekrane paslėptas.

## 1.0.0-draft – 2026-09-30

- Pridėtas lietuviškas, responsyvus kelių puslapių SaaS šablonas su neutraliu „Pavyzdys“ prekės ženklo pavyzdžiu.
- Temos pasirinkimas nustatomas iki pirmo CSS atvaizdavimo, seka OS nuostatą ir atnaujina naršyklės temos spalvą.
- Kontaktų forma siunčia tik esant sukonfigūruotam HTTPS endpointui; be jo aiškiai veikia demonstraciniu režimu ir išsaugo įvestį.
- Pašalinti išoriniai ikonų, šriftų, portretų, klientų logotipų ir socialinių tinklų CDN / nuorodų pavyzdžiai.
- Pridėti apie, privatumo, sąlygų ir 404 puslapių ruošiniai, favicon, socialinė iliustracija, `robots.txt` ir `sitemap.xml`.
- Pridėta vietinių „DejaVu Sans“ šriftų licencija, trečiųjų šalių sąrašas, AI atskleidimas ir teisių perdavimo kontrolinis sąrašas.

Ši versija nėra teisiškai patvirtintas išimtinių teisių perleidimo paketas.
