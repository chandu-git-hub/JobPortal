const multer = require("multer");
const express = require("express");
const router = express.Router();
const SingleFile = require("../db/Singlefile");
const { upload } = require("./helperfile");

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
const singleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const file = new SingleFile({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    });

    await file.save();
    res.status(201).send({
      message: "File uploaded successfully",
      fileName: req.file.filename,
      filePath: req.file.path,
    }); // Return the saved file details
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

router.post("/resume", upload.single("file"), singleFileUpload);
module.exports = router;



// router.post("/profile", upload.single("file"), (req, res) => {
//   const { file } = req;
//   if (
//     file.detectedFileExtension != ".jpg" &&
//     file.detectedFileExtension != ".png"
//   ) {
//     res.status(400).json({
//       message: "Invalid format",
//     });
//   } else {
//     const filename = `${uuidv4()}${file.detectedFileExtension}`;

//     pipeline(
//       file.stream,
//       fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
//     )
//       .then(() => {
//         res.send({
//           message: "Profile image uploaded successfully",
//           url: `/host/profile/${filename}`,
//         });
//       })
//       .catch((err) => {
//         res.status(400).json({
//           message: "Error while uploading",
//         });
//       });
//   }
// });

module.exports = router;
