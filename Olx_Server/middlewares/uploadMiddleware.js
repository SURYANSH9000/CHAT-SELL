// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const profilePicPath = path.join(__dirname, '../../Olx_Client/src/assets/profilePic');
// const productImagePath = path.join(__dirname, '../../Olx_Client/src/assets/productImages');

// // Ensuring the directories exist
// if (!fs.existsSync(profilePicPath)) {
//   fs.mkdirSync(profilePicPath, { recursive: true });
// }
// if (!fs.existsSync(productImagePath)) {
//   fs.mkdirSync(productImagePath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let destinationPath;
//     if (file.fieldname === 'profilePic') {
//       destinationPath = profilePicPath;
//     } else if (file.fieldname === 'images') {
//       const productDir = path.join(productImagePath, req.body.name);
//       if (!fs.existsSync(productDir)) {
//         fs.mkdirSync(productDir, { recursive: true });
//       }
//       destinationPath = productDir;
//     }
//     console.log(`Saving file to: ${destinationPath}`); 
//     cb(null, destinationPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage ,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB as file size limit
//  });

// module.exports = upload;

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (file.fieldname === 'profilePic') {
        return 'profile_pics'; // Folder in Cloudinary for profile pictures
      } else if (file.fieldname === 'images') {
        return `product_images/${req.body.name}`; // Folder for product images
      }
    },
    format: async (req, file) => 'png', // Format can be 'png', 'jpg', etc.
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Public ID in Cloudinary
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50 MB limit

module.exports = upload;
