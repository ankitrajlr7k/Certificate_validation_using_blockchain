import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ 
      message: "User created successfully!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials!" });

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials!" });

    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });
    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        sameSite: "strict",
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully!" });
};
