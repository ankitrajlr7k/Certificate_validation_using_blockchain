import prisma from "../lib/prisma.js";
import csv from "csvtojson";
export const importUser = async (req, res, next) => {
  try {
    const userData = [];

    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        response.map((res) => {
          userData.push({
            name: res.name,
            email: res.email,
          });
        });

        await prisma.excel.createMany({
          data: userData,
        });
        console.log("Data uploaded to mongoDB");
      });
    res.status(200).json({ message: "Successfully uploaded csv file!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to upload csv file!!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;
  const { password, avatar, ...otherItems } = req.body;
  if (id !== tokenId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this user" });
  }
  let updatedPassword;
  if (password) {
    updatedPassword = await bcrypt.hash(password, 10);
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        ...otherItems,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar: avatar }),
      },
    });
    const { password: userPassword, ...others } = updatedUser;
    res.status(200).json(others);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
