import { useState } from "react";

export default function Profile() {
  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");

  return (
    <main className="page profile-page">
      <h1>👤 Oma profiili</h1>
      <p>Kerro vähän itsestäsi!</p>

      <label htmlFor="profile-name">Nimi</label>
      <input
        id="profile-name"
        placeholder="Kirjoita nimesi"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="profile-interests">Kiinnostuksen kohteet</label>
      <textarea
        id="profile-interests"
        placeholder="Esim. musiikki, urheilu, pelit..."
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
      />

      <div className="profile-preview">
        <h3>Profiilisi esikatselu</h3>
        <p>👋 {name || "Uusi JoinUP-käyttäjä"}</p>
        <p>💜 {interests || "Lisää kiinnostuksen kohteesi"}</p>
      </div>
    </main>
  );
}
