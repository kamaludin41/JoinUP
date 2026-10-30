
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import yhteys from './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('JoinUp palvelin toimii');
});


app.get('/api/events', async (req, res) => {
    try {
        const [tapahtumat] = await yhteys.query(
            'SELECT * FROM events ORDER BY date ASC'
        );

        res.json(tapahtumat);
    } catch (virhe) {
        console.error(virhe);
        res.status(500).json({
            virhe: 'Tapahtumien hakeminen epäonnistui'
        });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const [kayttajat] = await yhteys.query(
            'SELECT id, name, email, created_at FROM users'
        );

        res.json(kayttajat);
    } catch (virhe) {
        console.error(virhe);
        res.status(500).json({
            virhe: 'Käyttäjien hakeminen epäonnistui'
        });
    }
});


app.get('/api/users/:id', async (req, res) => {
    try {
        const [kayttajat] = await yhteys.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [req.params.id]
        );

        if (kayttajat.length === 0) {
            return res.status(404).json({
                virhe: 'Käyttäjää ei löydy'
            });
        }

        res.json(kayttajat[0]);
    } catch (virhe) {
        console.error(virhe);
        res.status(500).json({
            virhe: 'Käyttäjän hakeminen epäonnistui'
        });
    }
});


app.get('/api/health', async (req, res) => {
    try {
        await yhteys.query('SELECT 1');

        res.json({
            palvelin: 'toimii',
            tietokanta: 'yhdistetty'
        });
    } catch (virhe) {
        console.error(virhe);
        res.status(500).json({
            palvelin: 'toimii',
            tietokanta: 'yhteys epäonnistui'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
});
