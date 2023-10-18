const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

const thoughtSchema =  new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => date.toDateString()
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [
            Reaction
        ],
},
{
    toJSON: {
        getters: true,
        virtuals: true,
    },
    id: false,
}
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;