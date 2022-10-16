const path = require("path");
const uuidv4 = require("uuid").v4;

async function fileUpload(fileData, folder) {
  if (!fileData) return;
  try {
    const fileName = req.files.pictureProfile.name;
    const fileNameExt = fileName.split(".").slice(-1);
    const newFilename = uuidv4();
    if (!folder) {
      const fileLoc = path.join(
        "public",
        "uploads",
        newFilename + "." + fileNameExt
      );
    } else {
      const fileLoc = path.join(
        "public",
        "uploads",
        folder,
        newFilename + "." + fileNameExt
      );
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
