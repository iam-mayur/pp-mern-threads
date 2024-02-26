import User from "../models/User.js";
import bcrypt from "bcryptjs";
import setTokenAndCookie from "../util/setTokenAndCookie.js";

export const signUpUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
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
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
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
      return res.json(400).json({ message: "You can't follow yourself" });

    if (!userToModify || !currentUser) {
      return res.status(400).json({ message: "User not found" });
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
  let { name, email, username, password, bio, profilePic } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (req.params.id !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Cannot update other user's profile" });
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;
    user = await user.save();

    user.password = null; // remove password from response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updating user : ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");
    if (!user) return res.status(400).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getting user profile : ", error);
    res.status(500).json({ error: error.message });
  }
};
