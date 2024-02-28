import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;
    if (!postedBy || !text)
      return res
        .status(400)
        .json({ error: "PostedBy and text fields are required" });

    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user._id.toString() !== req.user._id.toString())
      return res.status(401).json({ error: "Unauthorized " });

    const maxLength = 400;
    if (text.length > maxLength)
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });

    const newPost = await Post.create({
      postedBy,
      text,
      img,
    });
    if (newPost) {
      res.status(201).json(newPost);
    } else {
      res.status(400).json({ error: "Invalid post data received" });
    }
  } catch (err) {
    console.error("Error in creating post : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (err) {
    console.error("Error in getting post : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    console.error("Error in getting feed posts : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getting user posts : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      // Unlike post
      await Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: userId } }
      );
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    console.error("Error in liking post : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    console.error("Error in replying post : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.postedBy.toString() === req.user._id.toString()) {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (err) {
    console.error("Error in deleting post : ", err.message);
    res.status(500).json({ error: err.message });
  }
};
