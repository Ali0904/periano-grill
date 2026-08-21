import fs from "fs";
import { pathToFileURL } from "url";

const html = await (await fetch("https://pepes.co.uk/menu")).text();
const re = /<img[^>]+src="(https:\/\/pepes\.co\.uk\/wp-content\/webp-express\/webp-images\/doc-root\/[^"]+\.webp)"[^>]*alt="([^"]*)"/g;
const out = [];
let m;
while ((m = re.exec(html))) out.push(m[1] + " || " + m[2]);
fs.writeFileSync("C:/Users/aliha/AppData/Local/Temp/opencode/pepes-imgs.txt", out.join("\n"));
console.log("found", out.length, "images");
console.log(out.slice(0, 30).join("\n"));
