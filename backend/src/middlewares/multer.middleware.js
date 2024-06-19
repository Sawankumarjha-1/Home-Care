import multer from "multer";

const storage = multer.diskStorage({
  //destination where we want to store file
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  //file name to save
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
