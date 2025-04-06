const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

const sprite = "SPRITE_NAME_HERE";
const filePath = path.join(__dirname, `${sprite}.sprite3`);
const outputDir = path.join(__dirname, sprite);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const zip = new AdmZip(filePath);
zip.extractAllTo(outputDir, true);

const spriteJsonPath = path.join(outputDir, "sprite.json");

if (fs.existsSync(spriteJsonPath)) {
  const spriteJson = fs.readFileSync(spriteJsonPath, "utf8");
  let json = JSON.parse(spriteJson) || { error: "Couldn't Parse JSON" };

  if (json.error) return console.log(json.error);

  if (json?.costumes) {
    json.costumes.forEach((costume) => {
      const name = costume.name;
      const ext = costume.dataFormat;
      const id = costume.assetId;
      const oldFilePath = path.join(outputDir, `${id}.${ext}`);
      if (fs.existsSync(oldFilePath)) {
        const newFilePath = path.join(outputDir, `${name}.${ext}`);
        try {
          fs.renameSync(oldFilePath, newFilePath);
          console.log(`Renamed: ${id}.${ext} -> ${name}.${ext}`);
        } catch (err) {
          console.error(`Error renaming file ${id}.${ext}:`, err);
        }
      } else {
        console.log(`File not found: ${id}${ext}`);
      }
    });
  }
} else {
  console.log("sprite.json not found in the unzipped directory.");
}
