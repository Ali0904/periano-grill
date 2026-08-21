import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "server", "src", "data", "menuItems.js");
const PUB = path.join(ROOT, "client", "public", "images");

const BASE = "https://pepes.co.uk/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/";
const U = (p) => BASE + p;

// our product name -> { url, folder }
const MAP = {
  "Whole Chicken": { url: U("2026/06/Whole-Chicken-16-9.png.webp"), folder: "grill" },
  "5 Tender Strips": { url: U("2026/05/Tender-Strips.png.webp"), folder: "grill" },
  "5 Wings": { url: U("2024/12/5348ca4725f01d1864afb9050120c1e4-300x216.png.webp"), folder: "grill" },
  "Chicken Box": { url: U("2026/05/Chicken-Box-16-9-Upscale.png.webp"), folder: "grill" },
  "Chick 'N' Rice": { url: U("2026/05/ChickenNRice-16-9.png.webp"), folder: "grill" },
  "Loaded Fries": { url: U("2026/05/Chicken-Loaded-Fries-16-9-Upscale.png.webp"), folder: "grill" },
  "Chicken Loaded Fries": { url: U("2026/05/Chicken-Loaded-Fries-16-9-Upscale.png.webp"), folder: "grill" },
  "Chicken Nachos": { url: U("2026/05/Chicken-Nachos.png.webp"), folder: "grill" },
  "Prime Pitta": { url: U("2026/05/Prime-Pitta-16-9-Upscale.png.webp"), folder: "grill" },
  "Chicken Salad": { url: U("2026/05/Chicken-Salad-16-9.png.webp"), folder: "grill" },
  "Texan Lamb": { url: U("2026/05/Texan-Lamb-16-9-Upscale.png.webp"), folder: "grill" },
  "Chicken Tasca": { url: U("2026/05/Chicken-Tasca-16-9.png.webp"), folder: "grill" },
  "Fries": { url: U("2025/10/Fries-Regular-500-290x300.png.webp"), folder: "sides" },
  "Large Fries": { url: U("2025/10/Fries-Regular-500-290x300.png.webp"), folder: "sides" },
  "Wedges": { url: U("2024/12/pepes-wedges-300x218.png.webp"), folder: "sides" },
  "Spicy Rice": { url: U("2024/12/69760261164286bd97d6e3ccf52e4e6d-300x227.png.webp"), folder: "sides" },
  "Corn on the Cob": { url: U("2024/12/595642072511cd93976b6a4e9a9efc3d-300x133.png.webp"), folder: "sides" },
  "Piri Corn": { url: U("2024/12/595642072511cd93976b6a4e9a9efc3d-300x133.png.webp"), folder: "sides" },
  "Piri Piri Corn on Cob": { url: U("2024/12/595642072511cd93976b6a4e9a9efc3d-300x133.png.webp"), folder: "sides" },
  "Onion Rings": { url: U("2024/12/311c9afccaad083117ac446f74b1a054.png.webp"), folder: "sides" },
  "Mozzarella Sticks": { url: U("2024/12/f601fe2cd0781b86f35e3704edb0c8d2-300x177.png.webp"), folder: "sides" },
  "Side Salad": { url: U("2024/12/083f1bb627fe106bf79cdae9c890f97a-300x256.png.webp"), folder: "sides" },
  "Chilli Cheese Nuggets": { url: U("2024/12/244a02ef055e2cc875cf1438bb79f2cd-300x226.png.webp"), folder: "sides" },
  "3x Tender Strips": { url: U("2024/12/pepes-menu-3x-tender-strips-300.png.webp"), folder: "sides" },
  "3x Wings": { url: U("2024/12/24845a7fb592d0c02ce7180cb992e3a9-300x188.png.webp"), folder: "sides" }
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const { menuItems } = await import(pathToFileURL(DATA).href);

let updated = 0;
for (const item of menuItems) {
  const m = MAP[item.name];
  if (!m) continue;
  const file = `${slug(item.name)}.webp`;
  try {
    const res = await fetch(m.url);
    if (!res.ok) throw new Error(res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(PUB, m.folder, file), buf);
    item.image = `/images/${m.folder}/${file}`;
    updated++;
    console.log("ok", item.name, "->", file);
  } catch (e) {
    console.log("FAIL", item.name, e.message);
  }
}

const out = `// Auto-generated from D:\\perianno final\\server\\data\\products.js\n` +
  `export const menuItems = ${JSON.stringify(menuItems, null, 2)};\n`;
fs.writeFileSync(DATA, out);
console.log("updated", updated, "images");
