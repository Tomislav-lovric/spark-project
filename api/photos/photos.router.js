const express = require("express");
const router = express.Router();
const multer = require('multer');
const { checkToken } = require('../../auth/token_validation');
const photos = require('./photos.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-'));
  }
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter
});


router.post("/", checkToken, upload.single("photo"), photos.addPhoto);

router.patch("/:photo_id", checkToken, upload.single("photo"), photos.changePhoto);

router.get("/id/:photo_id", checkToken, photos.getPhotoByPhotoId);

router.get("/", checkToken, photos.getMultiplePhotos);

router.get("/search", checkToken, photos.getPhotoByName);

router.get("/asc/:userKey", checkToken, photos.sortPhotosASC);

router.get("/desc/:userKey", checkToken, photos.sortPhotosDESC);

router.delete("/", checkToken, photos.deletePhotoByPhotoId);

module.exports = router;