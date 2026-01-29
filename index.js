const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));
app.use("/uploads", express.static("uploads"));

// ---------- FILE UPLOAD ----------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ---------- API ----------
app.post("/predict", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;

  const python = spawn("python", ["ml/predict.py", imagePath], {
    env: { ...process.env, PYTHONIOENCODING: "utf-8" }
  });

  let output = "";

  python.stdout.on("data", data => {
    output += data.toString();
  });

  python.stderr.on("data", err => {
    console.error("PY ERROR:", err.toString());
  });

  python.on("close", () => {
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Prediction failed" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ FarmGrade AI running at http://localhost:${PORT}`);
});
