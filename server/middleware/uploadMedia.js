const multer = require('multer');

const upload = multer().single('media');

const uploadMedia = (req, res, next) => {
	// if (req.body.mediaType === 'image') upload.array('media', 5);
	upload(req, res, (err) => {
		if (err) res.status(400).json({ message: err.message });
		else next();
	});
};

module.exports = uploadMedia;
