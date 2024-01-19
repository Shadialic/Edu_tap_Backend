const cloudinary = require('cloudinary');
const multer = require('multer');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

function checkFileType(file, cb) {
    console.log(file,'jjjjjjjjjjj');
    const allowedFileTypes = ['jpeg', 'jpg', 'png', 'pdf', 'doc', 'webp'];

    const mimetype = allowedFileTypes.includes(file.mimetype.split('/')[1]); // Extracting the file type from mimetype
    const extname = allowedFileTypes.includes(path.extname(file.originalname).toLowerCase().substring(1)); // Removing the dot from the extension
    
console.log(extname,'pppppppppppppppp',mimetype);
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed types: ' + allowedFileTypes.join(', ')));
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('multer success');
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadImage = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if the file object is present
        if (!file) {
            return cb(new Error('No file provided.'));
        }

        checkFileType(file, cb);
    }
});


const generateDeleteToken = (publicId) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Check if timestamp is within acceptable range (e.g., 15 minutes in the future)
    const expirationTime = timestamp + 900; // 15 minutes in seconds
    const currentTime = Math.round(new Date().getTime() / 1000);
    if (currentTime > expirationTime) {
        throw new Error('Timestamp is too far in the future');
    }

    const signature = cloudinary.utils.api_sign_request(
        { public_id: publicId, timestamp },
        process.env.CLOUDINARY_SECRET
    );

    // Verify signature using Cloudinary's API signing function
    const isValidSignature = cloudinary.utils.api_sign_request(
        { public_id: publicId, timestamp },
        signature,
        process.env.CLOUDINARY_SECRET
    );

    if (!isValidSignature) {
        throw new Error('Invalid signature');
    }

    return { timestamp, signature };
};


function getPublicIdFromCloudinaryUrl(url) {
    const parts = url.split('/');
    const publicIdIndex = parts.indexOf('upload') + 1;

    if (publicIdIndex > 0 && publicIdIndex < parts.length) {
        return parts[publicIdIndex];
    }

    return null;
}

const deleteImageFromCloudinary = async (publicId, token, timestamp) => {
    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dn6anfym7/delete_by_token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    timestamp,
                    public_ids: [publicId],
                }),
            }
        );

        const result = await response.json();
        console.log('Cloudinary API Response:', result);

        if (result.result === 'ok' && result.deleted && result.deleted[publicId] === 'ok') {
            console.log('Image successfully deleted from Cloudinary');
            return result;
        } else {
            console.error('Error deleting image from Cloudinary:', result);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports = {
    cloudinary,
    uploadImage,
    deleteImageFromCloudinary,
    generateDeleteToken,
    getPublicIdFromCloudinaryUrl
  };