const { User, Thought } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .select('-__v');

            if(!user) {
                return res.status(404).json({ message: 'No user found with this ID!' });
            }

            res.json(user);
        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // create a user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID!' });
            }

            res.json(user);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    }, 
    // delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if(!user) {
                res.status(404).json({ message: 'No user found with that ID!' });
            }

            await Thought.deleteMany({ _id: {$in: user.thoughts} });
            res.json({ message: 'User and associated Thoughts deleted!' });
        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // create a friend
    async createFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

                if(!friend) {
                    return res.status(404).json({ message: 'No user found with that ID!' });
                }

                res.json(friend);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // delete a friend
    async deleteFriend(req, res) {
        try {

            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if(!friend) {
                return res.status(404).json({ message: 'No user found with this ID!' });
            }

            res.json(friend);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    }
};