import path from "path";
import fs from "fs";

export const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// ensure folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const makeExportFilePath = () => {
  const fileName = `export-${Date.now()}.xlsx`;
  return path.join(UPLOAD_DIR, fileName);
};
