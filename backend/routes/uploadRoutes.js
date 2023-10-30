
import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp|mp4|webm|ogg/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|video\/mp4|video\/webm|video\/ogg/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });

// Update the middleware to handle multiple image uploads
const uploadMultipleImages = upload.array('images', 5); // You can set the maxCount according to your requirement

router.post('/', (req, res) => {
  uploadMultipleImages(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
    }

    // Extract the array of image paths from req.files
    const imagePaths = req.files.map((file) => `/${file.path}`);

    res.status(200).send({
      message: 'Images uploaded successfully',
      images: imagePaths,
    });
  });
});

export default router;
