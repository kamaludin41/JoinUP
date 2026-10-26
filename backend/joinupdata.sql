
USE joinup;

-- Esimerkkikäyttäjät
INSERT INTO users (name, email, password_hash) VALUES
('Kamal', 'kamal@example.com', 'demo_hash_1'),
('Amina', 'amina@example.com', 'demo_hash_2');

-- Esimerkkitapahtumat
INSERT INTO events
(name, description, date, place, category, organizer_id, max_participants)
VALUES
(
    'Koulun peli-ilta',
    'Pelataan yhdessä lautapelejä ja videopelejä.',
    '2026-10-25 17:00:00',
    'Koulun aula',
    'Pelit',
    1,
    30
),
(
    'Ohjelmointityöpaja',
    'Harjoitellaan yhdessä JavaScript-ohjelmointia.',
    '2026-10-28 15:00:00',
    'Tietokoneluokka',
    'Opiskelu',
    2,
    20
),
(
    'Koripalloilta',
    'Pelataan koripalloa yhdessä.',
    '2026-11-02 18:00:00',
    'Liikuntasali',
    'Liikunta',
    1,
    15
);

-- Esimerkki-ilmoittautumiset
INSERT INTO registrations (user_id, event_id) VALUES
(2, 1),
(1, 2),
(2, 3);
