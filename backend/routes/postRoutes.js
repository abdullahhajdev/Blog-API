const express = require('express');
const {createPost, getAllPosts } = require('../controllers/postControllers');
const authMiddleware = require('../middleware/auth');


const router = express.Router();


router.get('/', authMiddleware,getAllPosts)
router.post('/', authMiddleware, createPost);


module.exports = router;