# Adatbázis struktúra módosítás javaslatok

1. A 10-es azonosítóhoz a várostáblában Szombathely tartozik, az importáló szkript viszont Turkeve adatait tölti be erre az azonosítóra. A 9-es azonosító szintén Szombathely, így a Turkeve adatai rossz városnév alatt jelennek meg.

2. A hiányzó adatokat a forrásfájlok `-999` értékkel jelölik. Ez az adatbázisban több ezer alkalommal szerepel, és torzíthatja az átlagokat, illetve a szélsőértékeket.

3. Egy rekordban a minimum-hőmérséklet nagyobb a maximumnál: a 10-es városnál, 1922.12.20-án. Ugyanez az érték a forrásfájlban is megtalálható, ezért érdemes ellenőrizni.

4. A mérési táblákból hiányoznak az elsődleges és idegen kulcsok, valamint az egyediségi feltételek. A dátum `BIGINT`, a mérési értékek pedig `FLOAT` típusúak.

5. Városadatok javítása: Egyeztesd a 10-es azonosítóhoz tartozó várost az importáló szkriptben használt adatokkal. Ha Turkeve a helyes, javítsd a várostáblát, ha Szombathely, akkor az importálást. A korábban betöltött adatokat is ellenőrizd.

6. Hiányzó adatok kezelése: A `-999` értékeket importáláskor alakítsd `NULL`-lá. Így nem torzítják a számításokat, és az átlagok csak a valódi méréseket veszik figyelembe.

7. Adatok ellenőrzése: Importáláskor ellenőrizd, hogy a minimum-hőmérséklet nem nagyobb-e a maximumnál, illetve a csapadék nem negatív-e. A hibás rekordokat különítsd el vagy jelezd.

8. Kulcsok hozzáadása: A `(city_id, date)` pár legyen elsődleges vagy egyedi kulcs, a `city_id` pedig idegen kulcsként hivatkozzon a `cities.id` mezőre. Ezzel elkerülhetők az ismétlődő mérések és az érvénytelen városazonosítók.

9.  Indexelés: A `(city_id, date)` összetett index gyorsíthatja a város és dátum szerinti lekérdezéseket, valamint a táblák összekapcsolását. Tesztekkel ellenőrizhető.

10. Adattípusok javítása: A `BIGINT` helyett használj `DATE` típust a dátumokhoz. A mérési értékeknél pedig a forrás pontosságától függően érdemes lehet `DECIMAL` típust választani a `FLOAT` helyett.

11. Régiók kezelése: A jelenlegi három régióhoz az `ENUM` megfelelő, vagy egy külön `regions` tábla  létrehozása is jó ötlet, amelyre a városok idegen kulccsal hivatkoznak.