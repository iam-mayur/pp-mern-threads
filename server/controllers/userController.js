import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import setTokenAndCookie from "../util/setTokenAndCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const signUpUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });
    if (newUser) {
      setTokenAndCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data received" });
    }
  } catch (err) {
    console.error("Error in sign up: ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      setTokenAndCookie(user._id, res);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error in login : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in logout : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res.json(400).json({ error: "You can't follow yourself" });

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!userToModify.followers.includes(req.user._id)) {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    }
  } catch (err) {
    console.error("Error in logout : ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Cannot update other user's profile" });
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const result = await cloudinary.uploader.upload(profilePic, {
        folder: "profile",
      });
      user.profilePic = result.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;
    user = await user.save();

    await Post.updateMany(
      { "replies.userId": req.user._id },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": req.user._id }] }
    );

    user.password = null; // remove password from response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updating user : ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  // Fetch user profile either with username or userId
  // query is either username or userId
  try {
    const { query } = req.params;
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getting user profile : ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    // exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;
    const usersFollowedByYou = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.isFrozen = true;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
