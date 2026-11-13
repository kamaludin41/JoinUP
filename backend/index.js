import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  createHmac,
} from "node:crypto";

import { promisify } from "node:util";
dotenv.config();

const scrypt = promisify(scryptCallback);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET puuttuu .env-tiedostosta.");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// Rekisteröidy
app.post("/api/auth/register", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({
        error: "JWT_SECRET puuttuu .env-tiedostosta.",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Täytä nimi, sähköposti ja salasana.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Salasanan pitää olla vähintään 8 merkkiä.",
      });
    }

    const users = await readData("users.json");

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (user) => user.email?.trim().toLowerCase() === normalizedEmail,
    );

    if (existingUser) {
      return res.status(409).json({
        error: "Sähköpostiosoite on jo käytössä.",
      });
    }

    const newUser = {
      id: nextId(users),
      name: name.trim(),
      email: normalizedEmail,
      password_hash: await hashPassword(password),
      interests: "",
    };

    users.push(newUser);
    await writeData("users.json", users);

    const token = createToken(newUser);

    res.status(201).json({
      message: "Rekisteröityminen onnistui!",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        interests: newUser.interests,
      },
    });
  } catch (error) {
    console.error("Rekisteröityminen epäonnistui:", error);
    res.status(500).json({
      error: "Rekisteröityminen epäonnistui.",
    });
  }
});

// Kirjaudu sisään
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({
        error: "JWT_SECRET puuttuu .env-tiedostosta.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Anna sähköposti ja salasana.",
      });
    }

    const users = await readData("users.json");

    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      (item) => item.email?.toLowerCase() === normalizedEmail,
    );

    if (!user || !user.password_hash) {
      return res.status(401).json({
        error: "Virheellinen sähköposti tai salasana.",
      });
    }

    const passwordIsValid = await verifyPassword(password, user.password_hash);

    if (!passwordIsValid) {
      return res.status(401).json({
        error: "Virheellinen sähköposti tai salasana.",
      });
    }

    const token = createToken(user);

    res.json({
      message: "Kirjautuminen onnistui!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        interests: user.interests || "",
      },
    });
  } catch (error) {
    console.error("Kirjautuminen epäonnistui:", error);

    res.status(500).json({
      error: "Kirjautuminen epäonnistui.",
    });
  }
});

// Hae kaikki käyttäjät
app.get("/api/users", async (req, res) => {
  try {
    const users = await readData("users.json");

    res.json(
      users.map(({ id, name, email, interests }) => ({
        id,
        name,
        email,
        interests: interests || "",
      })),
    );
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
// Hae kirjautuneen käyttäjän omat tapahtumat
app.get("/api/my-registrations", authenticateToken, async (req, res) => {
  try {
    const registrations = await readData("registrations.json");
    const events = await readData("events.json");

    const myRegistrations = registrations
      .filter((registration) => Number(registration.user_id) === req.user.id)
      .map((registration) => {
        const event = events.find(
          (item) => Number(item.id) === Number(registration.event_id),
        );

        return event ? { ...registration, event } : null;
      })
      .filter(Boolean);

    res.json(myRegistrations);
  } catch (error) {
    console.error("Omien tapahtumien hakeminen epäonnistui:", error);
    res.status(500).json({
      error: "Omien tapahtumien hakeminen epäonnistui.",
    });
  }
});

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
// Salasanan turvallinen hajautus
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);

  return `${salt}:${hash.toString("hex")}`;
}

// Salasanan tarkistus
async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, key] = storedHash.split(":");
  const expected = Buffer.from(key, "hex");
  const actual = await scrypt(password, salt, expected.length);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// JWT-tokenin luominen
function createToken(user) {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");

  const now = Math.floor(Date.now() / 1000);

  const payload = Buffer.from(
    JSON.stringify({
      sub: String(user.id),
      iat: now,
      exp: now + 7 * 24 * 60 * 60,
    }),
  ).toString("base64url");

  const data = `${header}.${payload}`;

  const signature = createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}
// Tarkista kirjautumisen JWT-token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token || !JWT_SECRET) {
    return res.status(401).json({
      error: "Kirjautuminen vaaditaan.",
    });
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("Virheellinen token");
    }

    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;

    const expectedSignature = createHmac("sha256", JWT_SECRET)
      .update(data)
      .digest();

    const actualSignature = Buffer.from(signature, "base64url");

    if (
      actualSignature.length !== expectedSignature.length ||
      !timingSafeEqual(actualSignature, expectedSignature)
    ) {
      throw new Error("Virheellinen allekirjoitus");
    }

    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    if (
      !decodedPayload.sub ||
      !decodedPayload.exp ||
      decodedPayload.exp < Math.floor(Date.now() / 1000)
    ) {
      throw new Error("Token vanhentunut");
    }

    req.user = {
      id: Number(decodedPayload.sub),
    };

    next();
  } catch {
    return res.status(401).json({
      error: "Kirjautuminen on vanhentunut. Kirjaudu uudelleen.",
    });
  }
}
// Hae kirjautuneen käyttäjän tiedot
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const users = await readData("users.json");

    const user = users.find((item) => Number(item.id) === req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "Käyttäjää ei löydy.",
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        interests: user.interests || "",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Käyttäjän hakeminen epäonnistui.",
    });
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
// Tarkistaa, onko kirjautunut käyttäjä ilmoittautunut tapahtumaan
app.get("/api/events/:id/registration", authenticateToken, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = req.user.id;

    const registrations = await readData("registrations.json");

    const isRegistered = registrations.some(
      (registration) =>
        Number(registration.user_id) === userId &&
        Number(registration.event_id) === eventId,
    );

    res.json({ isRegistered });
  } catch (error) {
    console.error("Ilmoittautumisen tarkistus epäonnistui:", error);
    res.status(500).json({
      error: "Ilmoittautumisen tarkistus epäonnistui.",
    });
  }
});
app.post("/api/events/:id/register", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = Number(req.params.id);

    const users = await readData("users.json");
    const events = await readData("events.json");
    const registrations = await readData("registrations.json");

    if (!users.some((user) => Number(user.id) === userId)) {
      return res.status(404).json({ error: "Käyttäjää ei löydy." });
    }

    const event = events.find((item) => Number(item.id) === eventId);

    if (!event) {
      return res.status(404).json({ error: "Tapahtumaa ei löydy." });
    }

    if (
      registrations.some(
        (r) => Number(r.user_id) === userId && Number(r.event_id) === eventId,
      )
    ) {
      return res.status(409).json({ error: "Olet jo ilmoittautunut." });
    }

    const participantCount = registrations.filter(
      (r) => Number(r.event_id) === eventId,
    ).length;

    if (
      event.max_participants !== null &&
      event.max_participants !== undefined &&
      participantCount >= Number(event.max_participants)
    ) {
      return res.status(409).json({ error: "Tapahtuma on täynnä." });
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
    console.error("Ilmoittautuminen epäonnistui:", error);
    res.status(500).json({ error: "Ilmoittautuminen epäonnistui." });
  }
});

// Peruuta ilmoittautuminen
app.delete("/api/events/:id/register", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = Number(req.params.id);

    const registrations = await readData("registrations.json");

    const registrationExists = registrations.some(
      (registration) =>
        Number(registration.user_id) === userId &&
        Number(registration.event_id) === eventId,
    );

    if (!registrationExists) {
      return res.status(404).json({
        error: "Ilmoittautumista ei löydy.",
      });
    }

    const updatedRegistrations = registrations.filter(
      (registration) =>
        !(
          Number(registration.user_id) === userId &&
          Number(registration.event_id) === eventId
        ),
    );

    await writeData("registrations.json", updatedRegistrations);

    res.json({
      ok: true,
      message: "Ilmoittautuminen peruttu onnistuneesti!",
    });
  } catch (error) {
    console.error("Ilmoittautumisen peruminen epäonnistui:", error);

    res.status(500).json({
      error: "Ilmoittautumisen peruminen epäonnistui.",
    });
  }
});

// users
app.put("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.id);

    // Varmista, että käyttäjä muokkaa vain omaa profiiliaan
    if (req.user.id !== userId) {
      return res.status(403).json({
        error: "Et voi muokata toisen käyttäjän profiilia.",
      });
    }

    const users = await readData("users.json");

    const userIndex = users.findIndex((user) => Number(user.id) === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        error: "Käyttäjää ei löydy.",
      });
    }

    const { name, interests } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        error: "Nimi ei voi olla tyhjä.",
      });
    }

    users[userIndex] = {
      ...users[userIndex],
      name: name !== undefined ? name.trim() : users[userIndex].name,
      interests:
        interests !== undefined ? interests : users[userIndex].interests || "",
    };

    await writeData("users.json", users);

    const updatedUser = users[userIndex];

    res.json({
      message: "Profiili tallennettu!",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        interests: updatedUser.interests || "",
      },
    });
  } catch (error) {
    console.error("Profiilin tallennus epäonnistui:", error);

    res.status(500).json({
      error: "Profiilin tallennus epäonnistui.",
    });
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
