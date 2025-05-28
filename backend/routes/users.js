const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');



router.get('/', authMiddleware, async (req,res) => {
    try{
        const users = await User.find({}, '-password')
        res.json(users)
    }catch(err) {
        console.error(err);
        res.status(500).json({message: `Server error`})
        
    }
})



router.get('/:id', authMiddleware, async (req,res) => {
    try{
        const user = await User.findById(req.params.id, '-password');
        if(!user) {
            return res.status(404).json({message: `User not found`})
        }
        res.json(user);
    }catch(err) {
        console.error(err);
        res.status(500).json({message: `Server error`})
    }
}
)

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Optional: only admin or the user themselves can delete
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;