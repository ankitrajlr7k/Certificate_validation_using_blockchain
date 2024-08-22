import express from "express";
import {
  generateCertificate,
  verifyCertificate,
} from "../controllers/generateCertificates/generateCertificate.js";

const router = express.Router();

router.get("/generateCertificate", generateCertificate);
router.post("/verifyCertificate", verifyCertificate);

export default router;
