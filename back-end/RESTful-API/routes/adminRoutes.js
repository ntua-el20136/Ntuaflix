const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // configure multer

const adminController = require('../controllers/adminController');
const validateToken = require('../middlewares/tokenValidator');
const adminAuth = require('../middlewares/adminAuth');

router.get('/healthcheck', validateToken, adminAuth, adminController.healthCheck);
router.post('/upload/titlebasics', validateToken, adminAuth, upload.single('file'), adminController.uploadTitleBasics);
router.post('/usermod/:username/:password', validateToken, adminAuth, express.json(), adminController.userMod);
router.get('/users/:username', validateToken, adminAuth, adminController.getUser);

module.exports = router;
