import fs from "fs";
import path from "path";

const root = process.cwd();
const monthsDir = path.join(root, "content", "months");
const publicMonthsDir = path.join(root, "public", "months");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(monthsDir)) {
  console.log(`[sync] No folder found: ${monthsDir}`);
  process.exit(0);
}

const monthFolders = fs
  .readdirSync(monthsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let count = 0;

for (const month of monthFolders) {
  const imagesSrc = path.join(monthsDir, month, "images");
  if (!fs.existsSync(imagesSrc)) continue;

  const imagesDest = path.join(publicMonthsDir, month, "images");
  copyDir(imagesSrc, imagesDest);
  count++;
}

console.log(`[sync] Copied images for ${count} month(s).`);
