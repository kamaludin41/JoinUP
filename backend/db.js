import mysql from 'mysql2/promise';

const yhteys = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ranjit@123',
    database: 'joinup'
});

export default yhteys;
