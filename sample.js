const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const user = {
  full_name: "Kumar_Aditya",
  dob: "22012003",
  email: "ka9557srmist.edu.in",
  roll_number: "RA2111003030282",
};

// POST Method
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data) {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input" });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));
  const highestLowercaseAlphabet =
    alphabets
      .filter((char) => char === char.toLowerCase())
      .sort()
      .pop() || null; // Use null if there are no lowercase letters

  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = 0;

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      fileSizeKB = buffer.length / 1024;

      // Simple MIME type check (you can enhance this)
      const hex = buffer.toString("hex", 0, 4);
      if (hex.startsWith("89504e47")) {
        // PNG
        fileMimeType = "image/png";
      } else if (hex.startsWith("47494638")) {
        // GIF
        fileMimeType = "image/gif";
      } else if (hex.startsWith("ffd8ffe0") || hex.startsWith("ffd8ffe1")) {
        // JPEG
        fileMimeType = "image/jpeg";
      } else {
        fileMimeType = "unknown";
      }
      fileValid = true;
    } catch (error) {
      fileValid = false;
    }
  }

  res.json({
    is_success: true,
    user_id: `${user.full_name}_${user.dob}`,
    email: user.email,
    roll_number: user.roll_number,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});

// GET Method
app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
