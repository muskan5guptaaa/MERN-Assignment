const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get all users (excluding self)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user } }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Send Friend Request (Implement a Friend Request Model if necessary)
// For simplicity, assuming direct friendship
router.post('/add/:id', auth, async (req, res) => {
    try {
        const userToAdd = await User.findById(req.params.id);
        if (!userToAdd) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const currentUser = await User.findById(req.user);
        if (currentUser.friends.includes(userToAdd.id)) {
            return res.status(400).json({ msg: 'Already friends' });
        }

        currentUser.friends.push(userToAdd.id);
        userToAdd.friends.push(currentUser.id);

        await currentUser.save();
        await userToAdd.save();

        res.json({ msg: 'Friend added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Remove Friend
router.post('/remove/:id', auth, async (req, res) => {
    try {
        const userToRemove = await User.findById(req.params.id);
        if (!userToRemove) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const currentUser = await User.findById(req.user);
        currentUser.friends = currentUser.friends.filter(friendId => friendId.toString() !== userToRemove.id);
        userToRemove.friends = userToRemove.friends.filter(friendId => friendId.toString() !== currentUser.id);

        await currentUser.save();
        await userToRemove.save();

        res.json({ msg: 'Friend removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Friends List
router.get('/friends', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('friends', '-password');
        res.json(user.friends);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Add this to routes/users.js



module.exports = router;
