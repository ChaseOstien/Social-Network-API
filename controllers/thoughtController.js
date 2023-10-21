const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thought = await Thought.find();
            res.json(thought);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

            if(!thought) {
                return res.status(404).json({ message: 'No thought found with this ID!' });
            }

            res.json(thought);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // create a thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                {_id: req.body.userId},
                { $addToSet: { thoughts: thought._id}},
                { new: true }
            );

            if(!user) {
                return res.status(404).json({ message: 'Thought created, but no user found with that ID!' });
            }

            res.json('Thought created!');

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
            );

                if(!thought) {
                    return res.status(404).json({ message: 'No thought found with that ID!' });
                }

                res.json(thought);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if(!thought) {
                return res.status(404).json( {message: 'No thought found with that ID!' });
            }

            res.json('Thought deleted!');

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // Create a reaction
    async addReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions:  req.body } },
                { runValidators: true, new: true }
            );

            if(!reaction) {
                return res.status(404).json({ message: 'No thought found with that ID!' });
            }

            reaction.json(reaction);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    },
    // Delete a reaction
    async removeReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: req.body.reactionId } },
                { runValidators: true, new: true }
            );

            if (!reaction) {
                return res.status(404).json({ message: 'No thought found with that ID!' });
            }

            res.json(reaction);

        } catch (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }
    }
};
