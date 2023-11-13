const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const dest = './public';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const path = `${dest}/${req.user._id}`;
    fs.mkdirSync(path, { recursive: true });
    
    cb(null, path);
  },
  filename: function(req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    
    if (!(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/webp' || file.mimetype == 'image/svg')) {
      return cb('File type must be .jpg, .jpeg, .png, .webp or .svg.', false);
    } else if (fileSize > 16777216) {
      return cb('File size must be below 16mb.', false);
    }
    
    cb(null, true);
  }
});

exports.uploadFolder = dest.slice(1);
exports.upload = upload;