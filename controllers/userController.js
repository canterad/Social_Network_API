const { Thought, User } = require('../models');

module.exports = {
  ////////////////////////////////////////////////////////////////////////////////////
  // Get All Users
  ////////////////////////////////////////////////////////////////////////////////////
  getUsers(req, res) {
    User.find()
    .then((users) => res.json(users))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },
  
  /////////////////////////////////////////////////////////////////////////////////////
  // Get a Single User by its _id, and populated thought and friend data.
  /////////////////////////////////////////////////////////////////////////////////////
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
  // Create A New User
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
  // deleteUser: Delete the user and the user's associated thoughts.
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

  ////////////////////////////////////////////////////////////////////////////////////
  // updateUser: Update user using the findOneAndUpdate method.  Uses the ID, and
  //             then $set operator in mongodb to inject the request body.  
  //             Enforces validation.
  ////////////////////////////////////////////////////////////////////////////////////
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
  // addFriend
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
  // deleteFriend
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
