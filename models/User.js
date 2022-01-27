const { Schema, model } = require('mongoose');

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ValidateEmail - This function validates the email address entered.  It returns true if the
// email address is formatted correctly, otherwise it returns a message about what is wrong.
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function ValidateEmail(input)
{
  let szTemp = input.trim();

  if (szTemp.length === 0)
  {
    return "You must enter a value.";
  }

  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (szTemp.match(regex))
  {
    return true;
  }
  else
  {
    return "Please enter a valid email address.";
  }
}

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
      validate: ValidateEmail 
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