const { Schema, model } = require('mongoose');

// Schema for what makes up a user.
const userSchema = new Schema({
    username: 
    {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email:
    {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email"
      },      
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,  
  }
);

// Create a virtual property `friendCount` that gets the length of the user's 'friends' array field on query.
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initialize the user model.
const User = model('user', userSchema);

module.exports = User;