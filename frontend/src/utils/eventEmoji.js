const eventEmojiRules = [
  [/jalkapallo|football|soccer/, "⚽"],
  [/\b(?:auto\w*|car|cars|bmw|race|kilpa.?ajo\w*)\b/, "🚗"],
  [/juhla|bile|party|syntymäpäivä/, "🎉"],
  [/pelailu|peli|lautapeli|game/, "🎲"],
  [/opiskelu|opiskelija|koulutus|study/, "📚"],
  [/kahvi|kahvittelu|coffee/, "☕"],
  [/kokka|ruoka|ruuanlaitto|cooking/, "🍳"],
  [/elokuva|movie|film/, "🎬"],
  [/kuntosali|treeni|liikunta|urheilu|sport/, "🏃"],
  [/musiikki|music/, "🎵"],
  [/tanssi|danc/, "💃"],
  [/jooga|yoga/, "🧘"],
  [/teknologia|technology|tech/, "💻"],
  [/ura|career|verkostoitum/, "💼"],
  [/tapaaminen|tutustuminen|meetup/, "🤝"],
];

export function getEventEmoji(event) {
  if (event.emoji && event.emoji !== "🎉") {
    return event.emoji;
  }

  const eventText = [event.title, event.category, event.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    eventEmojiRules.find(([pattern]) => pattern.test(eventText))?.[1] || "🎉"
  );
}
