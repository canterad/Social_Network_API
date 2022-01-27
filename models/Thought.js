const { Schema, model, Types } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId:
    {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody:
    {
      type: String,
      required: true,
      max: 280,
    },
    username:
    {
      type: String,
      required: true,
    },
    createdAt:
    {
      type: Date,
      default: Date.now,
    },
  }, 
  {
    toJSON: {
      virtuals: true,
    },
    id: false,  
  }
);

// Create a virtual property `formatTimeStamp` Getter function to format timestamp on query.
reactionSchema
  .virtual('formatTimeStamp')
  .get(function () {
    const localeTime = this.createAt.toLocaleTimeString();
    const localeDate = this.createdAt.tolocalDateString();
    return localeDate.concat(" ", localeDate);
  });

// Schema for what makes up a thought.
const thoughtSchema = new Schema(
  {
    thoughtText: 
    {
      type: String,
      required: true,
      min: 1,
      max: 280,
    },
    createdAt:
    {
      type: Date,
      default: Date.now,
    },
    username:
    {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,  
  }      
);

// Create a virtual property `reactionCount` that gets the length of the thought's 'reactions' array field on query.
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Create a virtual property `formatTimeStamp` Getter function to format timestamp on query.
thoughtSchema
  .virtual('formatTimeStamp')
  .get(function () {
    const localeTime = this.createAt.toLocaleTimeString();
    const localeDate = this.createdAt.tolocalDateString();
    return localeDate.concat(" ", localeDate);
  });

// Initialize the thought model.
const Thought = model('thought', thoughtSchema);

module.exports = Thought;