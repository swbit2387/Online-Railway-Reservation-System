const AppError = require(`${__dirname}/../utilities/appError`);
const multer = require('multer');
const sharp = require('sharp');
const { unlink } = require('node:fs/promises');

async function deleteFile(path) {
  try {
    await unlink(path);
    console.log(`Successfully deleted ${path}`);
  } catch (error) {
    console.error('There was an error:', error.message);
  }
}

exports.resizeUserPhoto = async (req, res, next) => {
  // console.log('from fileController.resizeUserPhoto', req.file);
  if (!req.file) return next();
  req.file.filename = `user-${req.currUser.id}-${Date.now()}.jpeg`;
  const previousFileName = req.currUser.photo;
  await sharp(req.file.buffer)
    .resize(800, 800)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  if (previousFileName && previousFileName != 'default.jpg')
    deleteFile(`public/img/users/${req.currUser.photo}`);
  next();
};

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.currUser.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please select image files only', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
