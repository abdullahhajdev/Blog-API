const express =require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');
require('dotenv').config();


router.post('/register', async (req,res) => {
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: `Please fill all fields`})
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: `User already exists`})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        })

       await user.save();

       res.status(201).json({message: 'User registered successfully'})
    }catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });  
    }
})



router.post('/login', async (req,res) => {
    try{
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: 'Please fill all fields'})
    }

    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).json({message: 'Invalid credentials'})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        return res.status(400).json({message: `Invalid credentials`})
    }

    const payload = {id: user._id, username: user.username, role: user.role};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});
    

    }catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;