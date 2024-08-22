const multer = require('multer');
const path = require('path');
const fs = require('fs');

const profilePicPath = path.join(__dirname, '../../Olx_Client/src/assets/profilePic');
const productImagePath = path.join(__dirname, '../../Olx_Client/src/assets/productImages');

// Ensuring the directories exist
if (!fs.existsSync(profilePicPath)) {
  fs.mkdirSync(profilePicPath, { recursive: true });
}
if (!fs.existsSync(productImagePath)) {
  fs.mkdirSync(productImagePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath;
    if (file.fieldname === 'profilePic') {
      destinationPath = profilePicPath;
    } else if (file.fieldname === 'images') {
      const productDir = path.join(productImagePath, req.body.name);
      if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
      }
      destinationPath = productDir;
    }
    console.log(`Saving file to: ${destinationPath}`); 
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage ,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB as file size limit
 });

module.exports = upload;
