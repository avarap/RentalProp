const path = require("path");
const uuidv4 = require("uuid").v4;

async function fileUpload(fileData, folder) {
  if (!fileData) return;
  try {
    const fileName = fileData.name;
    const fileNameExt = fileName.split(".").slice(-1);
    const newFilename = uuidv4();
    let fileLoc;
    if (!folder) {
      fileLoc = path.join("public", "uploads", newFilename + "." + fileNameExt);
    } else {
      fileLoc = path.join("public", "uploads", folder, newFilename + "." + fileNameExt);
    }
    await fileData.mv(fileLoc);
    if (!folder) {
      return newFilename + "." + fileNameExt;
    } else {
      return folder + "/" + newFilename + "." + fileNameExt;
    }
  } catch (err) {
    return "";
  }
}

module.exports = fileUpload;