import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { importUser, updateUser } from "../controllers/user.controller.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { verifyToken } from "../middleware/verifyToken.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const user = express();

user.use(bodyParser.urlencoded({ extended: true }));
user.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/importuser", upload.single("file"), importUser);
router.put("/:id", verifyToken, updateUser);

export default router;
