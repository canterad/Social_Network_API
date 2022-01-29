const { Thought, User } = require('../models');

module.exports = {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get All Thoughts:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  getThoughts(req, res) {
    Thought.find()
    .then((thought) => res.json(thought))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });      
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get a single thought.
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought found with that id!' })
        : res.json(thought)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Create A Thought.
  // Need to find the user for the userId value passed in and set the thoughtId value.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createThought(req, res) {
    Thought.create(req.body)
    .then((thought) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id} },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res
          .status(404)
          .json({ message: 'Thought created, but found no user with that ID' })
        : res.json('Created the thought.')    
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // updateThought:
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateThought(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this ID'})
        : res.json(thought)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });        
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // deleteThought:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this ID!' })
        : res.json({ message: 'Thought with id = ' + req.params.thoughtId.toString() + ' was deleted!'}))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });    
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // createReaction: Find the thought and update with the reaction.
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .then((dbThoughtData) =>
      !dbThoughtData
        ? res.status(404).json({ message: 'No though with this id!' })
        : res.json(dbThoughtData)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // deleteReaction: Find the thought and delete its reaction.
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
    .then((dbThoughtData) =>
      !dbThoughtData
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(dbThoughtData)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);    
    });
  },
};