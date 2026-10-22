JoinUP on verkkosovellus, joka auttaa opiskelijoita ja nuoria aikuisia löytämään kiinnostavia tapahtumia ja osallistumaan niihin.
Sovelluksen tärkeimmät toiminnallisuudet ovat:
- Tulevien tapahtumien näyttäminen.
- Tapahtumien tietojen tarkastelu ja etsiminen.
- Uusien tapahtumien luominen.
- Tapahtumiin ilmoittautuminen ja ilmoittautumisen peruuttaminen.
- Omien ilmoittautumisten tarkastelu.
- Oman tapahtuman muokkaaminen ja poistaminen.
- Tapahtumien osallistujamäärän näyttäminen.
Toiminnallisuudet toteutetaan projektin aikana.
Projektiryhmän jäsenet: Lisätään ryhmän jäsenten nimet.
GitHub-repository: https://github.com/kamaludin41/JoinUP
Julkaistu sovellus: Lisätään, kun sovellus on julkaistu.
- React: käyttöliittymän rakentaminen.
- JavaScript: sovelluksen toiminnallisuus.
- Vite: frontendin kehittäminen ja käynnistäminen.
- Node.js: backendin suorittaminen.
- Express: backendin ja API-rajapintojen toteuttaminen.
- SQLite: tietojen tallentaminen, jos se on projektin lopullinen tietokanta.
- Git ja GitHub: koodin versionhallinta ja ryhmätyö.
- Microsoft Azure: sovelluksen julkaiseminen.
Tietokoneella pitää olla asennettuna Node.js, npm, Git ja koodieditori.
Avaa terminaali ja suorita:
```
git clone https://github.com/kamaludin41/JoinUP.git
cd JoinUP
```
Avaa terminaali projektin kansiossa ja suorita:
```
cd backend
npm install
npm start
```
Jos npm start ei toimi, tarkista backendin package.json-tiedostosta oikea käynnistyskomento.
Avaa toinen terminaali projektin juurikansiossa ja suorita:
```
cd frontend
npm install
npm run dev
```
Avaa selaimessa terminaalin ilmoittama osoite.
Tietokannan käyttöönotto ja mahdolliset ympäristömuuttujat dokumentoidaan, kun toteutus on valmis. Tarvittavat ympäristömuuttujat voidaan esitellä .env.example-tiedostossa. Salaisia tunnuksia tai salasanoja ei tallenneta GitHubiin.
JoinUP koostuu frontendistä, backendistä ja tietokannasta.
- Frontend on Reactilla toteutettu käyttöliittymä, jota käytetään selaimessa.
- Backend käyttää Node.js:ää ja Expressiä pyyntöjen käsittelyyn.
- Tietokanta tallentaa sovelluksen tiedot.
Sovelluksen toimintaketju:
1. Käyttäjä käyttää sovellusta selaimessa.
2. Frontend lähettää pyynnön backendille.
3. Backend käsittelee pyynnön.
4. Backend hakee tai tallentaa tietoja tietokantaan.
5. Backend palauttaa vastauksen frontendille.
6. Frontend näyttää tiedot käyttäjälle.
Tietokantaan on tarkoitus tallentaa tapahtumien tiedot ja ilmoittautumiset.
Tapahtumien tietoja voivat olla esimerkiksi:
- Tapahtuman tunniste ja nimi.
- Kuvaus.
- Päivämäärä ja kellonaika.
- Paikka.
- Tapahtuman luoja.
Ilmoittautumistiedoissa yhdistetään tapahtuma ja osallistuja.
Tietokannan lopulliset taulut, niiden väliset suhteet ja tietokannan alustamisohjeet lisätään, kun tietokanta on toteutettu.
Frontend ja backend pidetään erillään, jotta käyttöliittymää ja palvelimen toimintaa voidaan kehittää itsenäisesti. API-rajapinnat mahdollistavat niiden välisen tiedonsiirron.
Backendin tehtäviä ovat esimerkiksi tapahtumien tietojen hakeminen, uusien tapahtumien tallentaminen ja ilmoittautumisten käsittely.
Lopulliseen dokumentaatioon lisätään toteutetut API-rajapinnat, niiden HTTP-metodit, osoitteet, pyynnöt ja vastaukset. Myös mahdolliset kirjautumis- ja käyttöoikeusvaatimukset dokumentoidaan toteutuksen mukaisesti.
Palvelimen pitää tarkistaa käyttäjän lähettämät tiedot ennen tallentamista. Jos sovellukseen toteutetaan kirjautuminen, käyttöoikeudet tarkistetaan ennen tapahtumien muokkaamista tai poistamista.
Kun sovellus on valmis, käyttäjä voi käyttää sitä seuraavasti:
1. Avaa JoinUP selaimessa.
2. Tutustu etusivulla näkyviin tapahtumiin.
3. Avaa tapahtuma ja tarkista sen tiedot.
4. Etsi kiinnostava tapahtuma hakutoiminnolla.
5. Ilmoittaudu tapahtumaan.
6. Tarkastele omia ilmoittautumisiasi ja peruuta ilmoittautuminen tarvittaessa.
7. Luo tai muokkaa tapahtumia sovelluksen tarjoamilla toiminnoilla.
Käyttöohjetta täydennetään vastaamaan valmista käyttöliittymää ja sen todellisia toimintoja.
Sovellus on tarkoitus julkaista Microsoft Azureen.
Julkaisun valmistuttua tähän lisätään julkaistun sovelluksen osoite, frontendin ja backendin sijainti, tietokannan käyttöönotto sekä tarvittavat ympäristömuuttujat.
Uusi versio julkaistaan projektissa sovitun GitHub- ja Azure-julkaisuprosessin mukaisesti. Julkaisun jälkeen sovelluksen toiminta testataan.
Dokumentaatiota päivitetään projektin aikana. Ennen lopullista palautusta tarkistetaan, että ohjeet vastaavat sovelluksen todellista toteutusta ja että toinen kehittäjä pystyy asentamaan ja käynnistämään sovelluksen niiden avulla.
