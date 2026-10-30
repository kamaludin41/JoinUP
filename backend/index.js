require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 3001);
const DATA_DIR = path.join(__dirname, "data");

const initialEvents = [];

const initialUsers = [
  { id: 1, name: "Kamal", email: "kamal@example.com" },
  { id: 2, name: "Amina", email: "amina@example.com" },
  { id: 3, name: "Ranjit", email: "ranjit@example.com" },
  { id: 4, name: "Renaton", email: "renaton@example.com" },
];

const initialRegistrations = [];

const initialData = {
  "events.json": initialEvents,
  "users.json": initialUsers,
  "registrations.json": initialRegistrations,
};

function filePath(filename) {
  return path.join(DATA_DIR, filename);
}

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  for (const [filename, data] of Object.entries(initialData)) {
    try {
      await fs.access(filePath(filename));
    } catch {
      await fs.writeFile(
        filePath(filename),
        JSON.stringify(data, null, 2),
        "utf8",
      );
    }
  }
}

app.get("/api/users", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  const usersFile = path.join(__dirname, "data", "users.json");

  try {
    if (!fs.existsSync(usersFile)) {
      return res.status(404).json({
        error: "Tiedostoa backend/data/users.json ei löydy.",
      });
    }

    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    res.json(users);
  } catch (error) {
    console.error("Käyttäjien lukeminen epäonnistui:", error);

    res.status(500).json({
      error: "Käyttäjien lukeminen epäonnistui.",
    });
  }
});

// Hae kaikki ilmoittautumiset
app.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await readData("registrations.json");
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ilmoittautumisten hakeminen epäonnistui",
    });
  }
});

async function readData(filename) {
  const content = await fs.readFile(filePath(filename), "utf8");
  return JSON.parse(content);
}

async function writeData(filename, data) {
  await fs.writeFile(filePath(filename), JSON.stringify(data, null, 2), "utf8");
}

function nextId(items) {
  return (
    items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
  );
}

// Hae kaikki tapahtumat
app.get("/api/events", async (req, res) => {
  try {
    const events = await readData("events.json");
    const registrations = await readData("registrations.json");

    res.json(
      events
        .map((event) => ({
          ...event,
          id: Number(event.id),
          participants: registrations.filter(
            (r) => Number(r.event_id) === Number(event.id),
          ).length,
        }))
        .sort((a, b) =>
          `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
        ),
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Tapahtumien haku epäonnistui" });
  }
});

// Lisää tapahtuma
app.post("/api/events", async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      date,
      time,
      organizer_id,
      max_participants,
    } = req.body;

    if (!title || !location || !category || !date || !time) {
      return res.status(400).json({
        error: "Täytä tapahtuman nimi, paikka, kategoria, päivä ja aika.",
      });
    }

    const events = await readData("events.json");

    const event = {
      id: nextId(events),
      title,
      description: description || "",
      location,
      category,
      date,
      time,
      organizer_id: Number(organizer_id || 1),
      max_participants:
        max_participants === "" ||
        max_participants === null ||
        max_participants === undefined
          ? null
          : Number(max_participants),
    };

    events.push(event);
    await writeData("events.json", events);

    res.status(201).json({ ...event, participants: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Tapahtuman tallennus epäonnistui" });
  }
});

// Muokkaa tapahtumaa
app.put("/api/events/:id", async (req, res) => {
  try {
    const events = await readData("events.json");
    const eventId = Number(req.params.id);
    const index = events.findIndex((event) => Number(event.id) === eventId);

    if (index === -1) {
      return res.status(404).json({ error: "Tapahtumaa ei löydy" });
    }

    const oldEvent = events[index];
    const body = req.body;

    const updatedEvent = {
      ...oldEvent,
      title: body.title ?? oldEvent.title,
      description: body.description ?? oldEvent.description,
      location: body.location ?? oldEvent.location,
      category: body.category ?? oldEvent.category,
      date: body.date ?? oldEvent.date,
      time: body.time ?? oldEvent.time,
      organizer_id:
        body.organizer_id === undefined
          ? oldEvent.organizer_id
          : Number(body.organizer_id),
      max_participants:
        body.max_participants === undefined
          ? oldEvent.max_participants
          : body.max_participants === "" || body.max_participants === null
            ? null
            : Number(body.max_participants),
    };

    if (
      !updatedEvent.title ||
      !updatedEvent.location ||
      !updatedEvent.category ||
      !updatedEvent.date ||
      !updatedEvent.time
    ) {
      return res.status(400).json({ error: "Pakollisia kenttiä puuttuu" });
    }

    events[index] = updatedEvent;
    await writeData("events.json", events);

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Tapahtuman muokkaus epäonnistui" });
  }
});

// Poista tapahtuma
app.delete("/api/events/:id", async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const events = await readData("events.json");
    const exists = events.some((event) => Number(event.id) === eventId);

    if (!exists) {
      return res.status(404).json({ error: "Tapahtumaa ei löydy" });
    }

    const remainingEvents = events.filter(
      (event) => Number(event.id) !== eventId,
    );
    const registrations = await readData("registrations.json");
    const remainingRegistrations = registrations.filter(
      (r) => Number(r.event_id) !== eventId,
    );

    await writeData("events.json", remainingEvents);
    await writeData("registrations.json", remainingRegistrations);

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Tapahtuman poistaminen epäonnistui" });
  }
});

// Ilmoittaudu tapahtumaan
app.post("/api/events/:id/register", async (req, res) => {
  try {
    const userId = Number(req.body.user_id);
    const eventId = Number(req.params.id);

    const users = await readData("users.json");
    const events = await readData("events.json");
    const registrations = await readData("registrations.json");

    if (!userId || !users.some((user) => Number(user.id) === userId)) {
      return res.status(400).json({ error: "Käyttäjää ei löydy" });
    }

    const event = events.find((item) => Number(item.id) === eventId);

    if (!event) {
      return res.status(404).json({ error: "Tapahtumaa ei löydy" });
    }

    if (
      registrations.some(
        (r) => Number(r.user_id) === userId && Number(r.event_id) === eventId,
      )
    ) {
      return res.status(409).json({ error: "Olet jo ilmoittautunut" });
    }

    const participantCount = registrations.filter(
      (r) => Number(r.event_id) === eventId,
    ).length;

    if (
      event.max_participants !== null &&
      event.max_participants !== undefined &&
      participantCount >= Number(event.max_participants)
    ) {
      return res.status(409).json({ error: "Tapahtuma on täynnä" });
    }

    const registration = {
      id: nextId(registrations),
      user_id: userId,
      event_id: eventId,
      registered_at: new Date().toISOString(),
    };

    registrations.push(registration);
    await writeData("registrations.json", registrations);

    res.status(201).json({ ok: true, registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ilmoittautuminen epäonnistui" });
  }
});

async function startServer() {
  await ensureDataFiles();

  app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
    console.log("Tallennus: backend/data/*.json (ei MariaDB:tä)");
  });
}

startServer().catch((error) => {
  console.error("Palvelimen käynnistys epäonnistui:", error);
  process.exit(1);
});
