/************************************************************************************
ORIGINAL CODE BELOW:
const { Post, Comment } = require('../models');

module.exports = {
  getComments(req, res) {
    Comment.find()
      .then((comment) => res.json(comment))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single comment
  getSingleComment(req, res) {
    Comment.findOne({ _id: req.params.commentId })
      .then((comment) =>
        !comment
          ? res.status(404).json({ message: 'No comment found with that id' })
          : res.json(comment)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a comment
  createComment(req, res) {
    Comment.create(req.body)
      .then((comment) => {
        return Post.findOneAndUpdate(
          { _id: req.body.postId },
          { $push: { comments: comment._id } },
          { new: true }
        );
      })
      .then((post) =>
        !post
          ? res
              .status(404)
              .json({ message: 'comment created, but no posts with this ID' })
          : res.json({ message: 'comment created' })
      )
      .catch((err) => {
        console.error(err);
      });
  },
};

*********************************************************************************************/

const { Thought, User } = require('../models');


module.exports = {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get All Thoughts:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
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
      .catch((err) => res.status(500).json(err));
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Create A Thought.
  // Need to find the user for the userId value passed in and set the thoughtId value.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createThought(req, res) {
    Thought.create(req.body)
    .then((dbThoughtData) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: ObjectId} },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res
          .status(404)
          .json({ message: 'Thought created, but found no user with that ID' })
        : res.json(dbThoughtData)    
    )
    .catch((err) => res.status(500).json(err));    
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
        .catch((err) => res.status(500).json(err));        
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // deleteThought:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
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
    .catch((err) => res.status(500).json(err));
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
    .catch((err) => res.status(500).json(err));
  },

// /api/thoughts/:thoughtId/reactions
//router.route('/thoughtId/reactions').post(createReaction);

// /api/thoughts/:thoughtId/reactions/reactionId
//router.route('/thoughtId/reactions/reactionId').delete(deleteReaction);




///////////////////////////////////////////////////////////////////////////
// CODE COPIES FROM OTHER PROJECT:
////////////////////////////////////////////////////////////////////////////
/*****************************************************************************
  // Add a video response
  addVideoResponse(req, res) {
    Video.findOneAndUpdate(
      { _id: req.params.videoId },
      { $addToSet: { responses: req.body } },
      { runValidators: true, new: true }
    )
      .then((video) =>
        !video
          ? res.status(404).json({ message: 'No video with this id!' })
          : res.json(video)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove video response
  removeVideoResponse(req, res) {
    Video.findOneAndUpdate(
      { _id: req.params.videoId },
      { $pull: { reactions: { responseId: req.params.responseId } } },
      { runValidators: true, new: true }
    )
      .then((video) =>
        !video
          ? res.status(404).json({ message: 'No video with this id!' })
          : res.json(video)
      )
      .catch((err) => res.status(500).json(err));
  },
  **************************************************************************************/







};