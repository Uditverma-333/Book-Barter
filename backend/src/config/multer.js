// config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book_uploads', // Folder where files will be stored in Cloudinary
        allowedFormats: ['jpg', 'png', 'jpeg', 'pdf'], // Specify allowed formats
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
