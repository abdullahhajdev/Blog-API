const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req,res) => {
    try{
        const {title, content} = req.body;
        const author = req.user.id;

        const newPost = new Post({
            title,
            content,
            author
        })
        await newPost.save();
        res.status(201).json({message: `Post created successfully`, post: newPost})
    }catch(err) {
        console.error(err);
        res.status(500).json({message: `Server error`})
    }
}

exports.getAllPosts = async (req,res) => {
    try{
        const posts = await Post.find().populate('author', 'username');
        res.status(200).json(posts);
    }catch(err) {
        console.error(err);
        res.status(500).json({message: `Server error`})
    }
}