const { Thought, User } = require('../models');

module.exports = {
  ////////////////////////////////////////////////////////////////////////////////////
  // getUsers: This GET route gets all users by calling the find method.
  ////////////////////////////////////////////////////////////////////////////////////
  getUsers(req, res) {
    User.find()
    .then((users) => res.json(users))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // getSingleUser: This GET route gets a Single User by the userId, and populated thought and friend data.
  // The populate method displays all of the data for the thought and friend items.
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .select('-__v')
    .populate('thoughts')
    .populate('friends')
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID!' })
        : res.json(user)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  ////////////////////////////////////////////////////////////////////////////////////
  // createUser: This POST route creates a new user.
  ////////////////////////////////////////////////////////////////////////////////////
  createUser(req, res) {
    User.create(req.body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  ////////////////////////////////////////////////////////////////////////////////////
  // deleteUser: This DELETE route deletes the user and the user's associated thoughts.
  ////////////////////////////////////////////////////////////////////////////////////
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID!' })
        : Thought.deleteMany({ _id: { $in: user.thoughts} })
    )
    .then(() => res.json({ message: 'User and associated thoughts deleted!'}))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // updateUser: This PUT route updates the user using the findOneAndUpdate method.  
  // Uses the ID, and then $set operator in mongodb to inject the request body and Enforces validation.
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!'})
        : res.json(user)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  ////////////////////////////////////////////////////////////////////////////////////
  // addFriend: This POST route adds the Friend ID to the users friends array.  It
  // selects the user based on the userId passed as a parameter.
  ///////////////////////////////////////////////////////////////////////////////////
  addFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId} },
        { runValidators: true, new: true }
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!'})
        : res.json(user)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  ///////////////////////////////////////////////////////////////////////////////////
  // deleteFriend: This DELETE route removes the friendId from the users friends
  // array.  This is done based on the userId and friendId parameters.
  ///////////////////////////////////////////////////////////////////////////////////
  deleteFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId} },
        { runValidators: true, new: true }
    )
    .then((user) =>
      !user
      ? res.status(404).json({ message: 'No user with this id!'})
      : res.json(user)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },  
};
