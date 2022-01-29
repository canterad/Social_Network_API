const { Thought, User } = require('../models');

module.exports = {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // getThoughts: This GET route gets all thoughts by calling the find method.
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
  // getSingleThought: This GET route gets a single thought based on the id value.
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
  // createThought: This POST route creates a new thought.  It also finds the user and saves the 
  // thought id for the new thought created in the user's thoughts array.
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
  // updateThought: This PUT route performs a thought update operation based on the thought Id passed as
  // a parameter.
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
  // deleteThought: This DELETE route performs a thought delete operation based on the thought Id passed 
  // as a parameter.
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
  // createReaction: This POST route finds the thought and adds the reaction to the thoughts reactions
  // array.
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
  // deleteReaction: This DELETE route finds the thought and deletes the reaction based on the reaction Id
  // passed as a parameter.
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