import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "server", "src", "data", "menuItems.js");
const PUB = path.join(ROOT, "client", "public", "images");
const FOLDER = { "grill-specialties": "grill", "sides": "sides", "kids-meals": "kids" };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// item name -> ordered TheMealDB search queries (first with a hit wins)
const REPL = {
  "Quarter Chicken": ["roast chicken", "chicken"],
  "Half Chicken": ["roast chicken", "chicken"],
  "Grilled Lamb Chops": ["lamb chops", "lamb", "steak"],
  "Mixed Grill Platter": ["mixed grill", "grill", "steak", "chicken"],
  "Peri Ribs": ["ribs", "bbq", "steak", "chicken"],
  "Seekh Kebab": ["kebab", "chicken"],
  "Tandoori Chicken": ["tandoori chicken", "chicken tikka", "chicken"],
  "Classic Espetada": ["chicken skewers", "skewers", "chicken"],
  "Steak & Chips": ["steak", "chips"],
  "Lamb Chops & Chips": ["lamb chops", "lamb", "steak"],
  "Chicken Loaded Fries": ["loaded fries", "fries", "chicken"],
  "Steak Loaded Fries": ["steak", "fries"],
  "Honey BBQ Strips": ["bbq chicken", "chicken", "steak"],
  "Large Fries": ["fries", "chips"],
  "Garlic Bread": ["garlic bread", "focaccia", "bread"],
  "Piri Corn": ["corn", "grilled corn"],
  "Piri Piri Corn on Cob": ["corn", "sweet corn"],
  "Coleslaw": ["coleslaw", "salad"],
  "Chicken Samosas": ["samosa", "indian chicken"],
  "Veg Samosas": ["samosa", "vegetable"],
  "Veg Spring Rolls": ["spring rolls", "rolls"],
  "Chips & Cheese": ["cheese fries", "fries", "cheese"],
  "Chips & Doner": ["doner", "kebab"],
  "Chips, Cheese & Doner": ["doner", "kebab", "fries"],
  "Kids Hot Dog Meal": ["hot dog", "sausage"]
};

const DIPS = [
  { name: "Piri Piri Mayo Dip", queries: ["hummus", "dip", "mayonnaise"], folder: "dips", file: "piri-mayo-dip.jpg" },
  { name: "Periano Grill Hot Sauce Bottle 250ml", queries: ["curry", "chilli", "hot"], folder: "dips", file: "hot-sauce-bottle.jpg" },
  { name: "Periano Grill Mango Lime Sauce Bottle 250ml", queries: ["mango", "sauce"], folder: "dips", file: "mango-lime-sauce.jpg" },
  { name: "Extra Piri Piri Dip", queries: ["hummus", "dip"], folder: "dips", file: "extra-piri-dip.jpg" },
  { name: "Make it Large", queries: ["fries", "chips"], folder: "addon", file: "make-it-large.jpg" },
  { name: "Add Extra Chicken", queries: ["grilled chicken", "chicken"], folder: "addon", file: "extra-chicken.jpg" }
];

let pick = 0;
async function thumb(queries) {
  for (const q of queries) {
    try {
      const j = await (await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`)).json();
      if (j.meals && j.meals.length) {
        const m = j.meals[pick++ % j.meals.length];
        return m.strMealThumb;
      }
    } catch {}
  }
  return null;
}
async function dl(url, dest) {
  for (let a = 1; a <= 3; a++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      return true;
    } catch (e) { if (a === 3) console.log("FAIL", url, e.message); }
  }
  return false;
}

const { menuItems } = await import(pathToFileURL(DATA).href);
let updated = 0, kept = 0;
for (const item of menuItems) {
  const queries = REPL[item.name];
  if (!queries) continue;
  const url = await thumb(queries);
  if (!url) { console.log("KEEP", item.name); kept++; continue; }
  const folder = FOLDER[item.category];
  const file = `${slug(item.name)}.jpg`;
  if (await dl(url, path.join(PUB, folder, file))) {
    item.image = `/images/${folder}/${file}`;
    updated++;
    console.log("ok", item.name);
  }
}

const dipMap = {};
for (const d of DIPS) {
  const url = await thumb(d.queries);
  if (url && await dl(url, path.join(PUB, d.folder, d.file))) {
    dipMap[d.name] = `/images/${d.folder}/${d.file}`;
    console.log("ok dip", d.file);
  } else {
    console.log("KEEP dip", d.name);
  }
}
fs.writeFileSync("C:/Users/aliha/AppData/Local/Temp/opencode/dipmap.json", JSON.stringify(dipMap, null, 2));

const out = `// Auto-generated from D:\\perianno final\\server\\data\\products.js\n` +
  `export const menuItems = ${JSON.stringify(menuItems, null, 2)};\n`;
fs.writeFileSync(DATA, out);
console.log(`menuItems updated=${updated} kept=${kept}`);
