import bodyParser from "body-parser";
import Web3 from "web3";
import { keccak256 } from "ethereumjs-util";
import prisma from "../../lib/prisma.js";
import Jimp from "jimp";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import QRCode from "qrcode";
import abi from "../../abis/CertificateStorage.json" assert { type: "json" };
const CertificateStorage = { abi };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

const contractAddress = "0x9a1a850632ed5eaf046beee2b35f8220195aadd8"; // Replace with your deployed contract address
const certificateStorage = new web3.eth.Contract(
  CertificateStorage.abi,
  contractAddress
);

// Function to store certificate hash in blockchain
const storeCertificateHash = async (userId, certificateData) => {
  const certificateDataBuffer = Buffer.from(certificateData, "base64"); // Convert to Buffer
  const combinedBuffer = Buffer.concat([
    Buffer.from(`${userId}`),
    certificateDataBuffer,
  ]);
  const hash = keccak256(combinedBuffer).toString("hex"); // Generate hash from combined Buffer
  const accounts = await web3.eth.getAccounts();
  await certificateStorage.methods
    .storeCertificateHash(`0x${hash}`)
    .send({ from: accounts[0] });
  return `0x${hash}`;
};

// Function to generate certificates and send email
const generateCertificates = async (userId) => {
  const user = await prisma.excel.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const certificateTemplate = await Jimp.read(
    path.join(__dirname, "/images/temp.png")
  );
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

  const namePositionY = 600; // Adjusted position of the name
  certificateTemplate.print(font, 900, namePositionY, user.name);

  // Generate and store certificate hash
  const certificateDataBuffer = await certificateTemplate.getBufferAsync(
    Jimp.MIME_PNG
  );
  const certificateHash = await storeCertificateHash(
    user.id,
    certificateDataBuffer
  );
  console.log(certificateHash);

  // Generate QR code with embedded data
  const qrData = {
    hash: certificateHash,
    userId: user.id,
    issuedAt: new Date().toISOString(),
  };
  const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
  const qrCodeImage = await Jimp.read(
    Buffer.from(qrCodeDataURL.split(",")[1], "base64")
  );

  // Add QR code to the certificate
  certificateTemplate.composite(qrCodeImage.resize(200, 200), 100, 1100);

  const outputPath = path.join(__dirname, `certificate-${user.id}.png`);
  await certificateTemplate.writeAsync(outputPath);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Your Certificate of Achievement",
    text: "Congratulations on your achievement! Please find your certificate attached.",
    attachments: [
      {
        filename: `certificate-${user.id}.png`,
        path: outputPath,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

export const generateCertificate = async (req, res) => {
  const users = await prisma.excel.findMany();
  const errors = []; // Added: Array to collect errors

  for (const user of users) {
    try {
      await generateCertificates(user.id);
      console.log(`Generated certificates for user ${user.name}`);
    } catch (error) {
      console.error(
        `Error generating certificate for user ${user.name}:`,
        error
      );
      errors.push(`Failed to generate certificate for user ${user.name}`); // Added: Collect error messages
    }
  }

  // Added: Send response based on whether there were errors
  if (errors.length > 0) {
    res.status(500).json({
      message: "Some certificates failed to generate.",
      errors, // Include specific error messages
    });
  } else {
    res.status(200).json({ message: "Successfully generated all certificates!" });
  }
};


export const verifyCertificate = async (req, res) => {
  const { hash, userId, issuedAt } = req.body;
  console.log(req.body);

  try {
    const isValid = await certificateStorage.methods
      .verifyCertificateHash(`${hash}`)
      .call();

    if (isValid) {
      const user = await prisma.excel.findUnique({ where: { id: userId } });
      if (user && new Date(issuedAt) < new Date()) {
        // Additional check for issued date
        res
          .status(200)
          .json({ message: "Successfully verified certificate!!" });
      } else {
        res.status(403).json({ message: "Failed to verify certificate!!" });
      }
    } else {
      res.status(403).json({ message: "Failed to verify certificate!!" });
    }
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res
      .status(500)
      .json({ valid: false, message: "Error verifying certificate." });
  }
};
