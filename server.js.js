const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();

/* 🔑 Render / Local compatible PORT */
const PORT = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));
app.use("/uploads", express.static("uploads"));

/* ---------- ENSURE UPLOADS FOLDER EXISTS ---------- */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* ---------- FILE UPLOAD CONFIG ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

/* ---------- API ---------- */
app.post("/predict", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;

    /* ✅ OS-SAFE Python command */
    const PYTHON_CMD = process.platform === "win32" ? "python" : "python3";

    const python = spawn(PYTHON_CMD, ["ml/predict.py", imagePath], {
      env: { ...process.env, PYTHONIOENCODING: "utf-8" }
    });

    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (err) => {
      console.error("🐍 PYTHON ERROR:", err.toString());
    });

    python.on("close", () => {
      try {
        const result = JSON.parse(output);
        res.json(result);
      } catch (error) {
        console.error("❌ JSON PARSE ERROR:", output);
        res.status(500).json({ error: "Prediction failed" });
      }
    });

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------- SERVER START ---------- */
app.listen(PORT, () => {
  console.log(`✅ FarmGrade AI running at http://localhost:${PORT}`);
});
