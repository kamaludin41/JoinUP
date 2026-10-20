const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("JoinUP backend toimii!");
});

const events = [
  {
    id: 1,
    name: "Koulun peli-ilta",
    date: "2026-10-25",
    place: "Koulun aula",
  },
  {
    id: 2,
    name: "Ohjelmointityöpaja",
    date: "2026-10-28",
    place: "Tietokoneluokka",
  },
];

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`JoinUP backend toimii portissa ${PORT}`);
});
