JoinUP on verkkosovellus, joka auttaa opiskelijoita ja nuoria aikuisia löytämään kiinnostavia tapahtumia ja osallistumaan niihin.
Sovelluksen tärkeimmät toiminnallisuudet ovat:
- Tulevien tapahtumien näyttäminen.
- Tapahtumien tietojen tarkastelu ja etsiminen.
- Uusien tapahtumien luominen.
- Tapahtumiin ilmoittautuminen ja ilmoittautumisen peruuttaminen.
- Omien ilmoittautumisten tarkastelu.
- Oman tapahtuman muokkaaminen ja poistaminen.
- Tapahtumien osallistujamäärän näyttäminen.
Projektiryhmä: Lisätään ryhmän jäsenten nimet.
GitHub: https://github.com/kamaludin41/JoinUP
Julkaistu sovellus: Lisätään, kun sovellus on julkaistu.
- React: käyttöliittymän rakentaminen.
- JavaScript: sovelluksen toiminnallisuus.
- Vite: frontendin kehittäminen.
- Node.js: backendin suorittaminen.
- Express: backendin ja API-rajapintojen toteuttaminen.
- SQLite: tietojen tallentaminen, jos tämä vahvistetaan projektin lopulliseksi tietokannaksi.
- Git ja GitHub: koodin versionhallinta ja ryhmätyö.
- Microsoft Azure: sovelluksen julkaiseminen projektin myöhemmässä vaiheessa.
Tietokoneella pitää olla Node.js, npm, Git ja koodieditori.
```
git clone https://github.com/kamaludin41/JoinUP.git
cd JoinUP
```
```
cd backend
npm install
npm start
```
Avaa toinen terminaali projektin juurikansiossa ja suorita:
```
cd frontend
npm install
npm run dev
```
Avaa selaimessa terminaalin ilmoittama osoite.
Tietokanta otetaan käyttöön backendin toteutuksen mukaisesti. Mahdolliset ympäristömuuttujat dokumentoidaan .env.example-tiedostossa. Salasanoja tai muita salaisia tietoja ei tallenneta GitHubiin.
Käynnistyskomennot ja asennusohjeet testataan ennen projektin palautusta.
JoinUP koostuu frontendistä, backendistä ja tietokannasta.
Frontend on Reactilla toteutettu käyttöliittymä. Backend käyttää Node.js:ää ja Expressiä pyyntöjen käsittelyyn. Frontend lähettää backendille HTTP-pyyntöjä API-rajapintojen kautta. Backend käsittelee pyynnöt ja hakee tai tallentaa tietoja tietokantaan.
Sovelluksen toimintaketju:
1. Käyttäjä käyttää sovellusta selaimessa.
2. Frontend lähettää pyynnön backendille.
3. Backend käsittelee pyynnön.
4. Backend hakee tai tallentaa tietoja tietokantaan.
5. Backend palauttaa vastauksen frontendille.
6. Frontend näyttää tiedot käyttäjälle.
Tietokantaan on tarkoitus tallentaa tapahtumien tiedot ja ilmoittautumiset.
Tapahtumien tietoja ovat esimerkiksi:
- Tapahtuman tunniste ja nimi.
- Kuvaus.
- Päivämäärä ja kellonaika.
- Paikka.
- Tapahtuman luoja.
Ilmoittautumistiedoissa yhdistetään tapahtuma ja osallistuja. Tietokannan lopulliset taulut, suhteet ja alustamisohjeet lisätään toteutuksen valmistuttua.
Seuraavat ovat suunniteltuja esimerkkejä rajapinnoista. Lopulliset osoitteet tarkistetaan backendin koodista.
Rajapintojen lähettämät tiedot, palautettavat JSON-vastaukset ja kirjautumisvaatimukset dokumentoidaan toteutuksen mukaisesti.
Frontend ja backend pidetään erillään, jotta käyttöliittymää ja palvelimen toimintaa voidaan kehittää itsenäisesti. API-rajapinnat mahdollistavat niiden välisen tiedonsiirron.
Palvelimen pitää tarkistaa käyttäjän lähettämät tiedot ennen tallentamista. Jos sovellukseen toteutetaan kirjautuminen, käyttäjän käyttöoikeudet tarkistetaan ennen tapahtumien muokkaamista tai poistamista.
Salaiset tunnukset säilytetään ympäristömuuttujissa eikä niitä tallenneta versionhallintaan.
1. Avaa JoinUP selaimessa.
2. Tutustu etusivulla näkyviin tapahtumiin.
3. Avaa tapahtuma ja tarkista sen tiedot.
4. Etsi kiinnostava tapahtuma hakutoiminnolla.
5. Ilmoittaudu tapahtumaan, kun toiminto on käytettävissä.
6. Tarkastele omia ilmoittautumisiasi ja peruuta ilmoittautuminen tarvittaessa.
7. Luo tai muokkaa tapahtumia sovelluksen tarjoamilla toiminnoilla.
Käyttöohje täydennetään vastaamaan valmista käyttöliittymää.
Projektin lähdekoodi sijaitsee GitHubissa:
https://github.com/kamaludin41/JoinUP
Sovellus on tarkoitus julkaista Microsoft Azureen. Julkaisun valmistuttua dokumentoidaan julkaistun sovelluksen osoite, frontendin ja backendin sijainti, tietokannan käyttöönotto sekä tarvittavat ympäristömuuttujat.
Uusi versio julkaistaan projektissa sovitun GitHub- ja Azure-julkaisuprosessin mukaisesti. Julkaisun jälkeen sovelluksen toiminta testataan.
Dokumentaatiota päivitetään projektin aikana. Ennen lopullista palautusta tarkistetaan, että ohjeet vastaavat sovelluksen todellista toteutusta ja että toinen kehittäjä pystyy asentamaan ja käynnistämään sovelluksen niiden avulla.
