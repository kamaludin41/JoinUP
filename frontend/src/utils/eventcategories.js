export const EVENT_CATEGORIES = [
  {
    name: "Urheilu",
    icon: "⚽",
    subcategories: [
      "Jalkapallo",
      "Koripallo",
      "Lentopallo",
      "Jääkiekko",
      "Sulkapallo",
      "Tennis",
      "Juoksu",
      "Kuntosali",
      "Sali",
      "Liikunta",
      "Fitness",
      "Jooga",
      "Uinti",
      "Pyöräily",
      "Tanssi",
      "Muu urheilu",
    ],
  },
  {
    name: "Pelit",
    icon: "🎮",
    subcategories: [
      "Videopelit",
      "Lautapelit",
      "E-urheilu",
      "Mobiilipelit",
      "Muu peli",
    ],
  },
  {
    name: "Tekoäly",
    icon: "🤖",
    subcategories: [
      "AI-työpaja",
      "AI-projektit",
      "AI-opiskelu",
      "Koneoppiminen",
      "Muu tekoäly",
    ],
  },
  {
    name: "Teknologia",
    icon: "💻",
    subcategories: [
      "Ohjelmointi",
      "Robotiikka",
      "Web-kehitys",
      "Teknologiakerho",
      "Muu teknologia",
    ],
  },
  {
    name: "Opiskelu",
    icon: "📚",
    subcategories: [
      "Ryhmäopiskelu",
      "Kielten opiskelu",
      "Läksykerho",
      "Opiskeluryhmä",
      "Muu opiskelu",
    ],
  },
  {
    name: "Viihde",
    icon: "🎬",
    subcategories: [
      "Elokuvat",
      "Musiikki",
      "Konsertit",
      "Kulttuuri",
      "Muu viihde",
    ],
  },
  {
    name: "Vapaa-aika",
    icon: "🎉",
    subcategories: [
      "Kahvittelu",
      "Retket",
      "Ystävät",
      "Tapaamiset",
      "Harrastukset",
      "Muu vapaa-aika",
    ],
  },
];

// Get the main category of an event
export function getMainCategory(event) {
  const category = (event?.category || "").trim();
  const subcategory = (event?.subcategory || "").trim();

  // Sports and fitness activities belong to Urheilu
  const sportsActivities = [
    "Urheilu",
    "Liikunta",
    "Jalkapallo",
    "Koripallo",
    "Lentopallo",
    "Jääkiekko",
    "Sulkapallo",
    "Tennis",
    "Juoksu",
    "Kuntosali",
    "Sali",
    "Fitness",
    "Jooga",
    "Uinti",
    "Pyöräily",
    "Tanssi",
    "Muu urheilu",
  ];

  if (
    sportsActivities.includes(category) ||
    sportsActivities.includes(subcategory)
  ) {
    return "Urheilu";
  }

  // Check main category
  const directCategory = EVENT_CATEGORIES.find(
    (item) => item.name === category
  );

  if (directCategory) {
    return directCategory.name;
  }

  // Check subcategory
  const foundCategory = EVENT_CATEGORIES.find(
    (item) => item.subcategories.includes(category) ||
              item.subcategories.includes(subcategory)
  );

  return foundCategory?.name || category;
}

// Get event subcategory
export function getSubcategory(event) {
  return event?.subcategory || "";
}
