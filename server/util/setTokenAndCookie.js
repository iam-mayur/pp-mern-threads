import jwt from "jsonwebtoken";

const setTokenAndCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  return token; // in case we need for testing
};

export default setTokenAndCookie;
