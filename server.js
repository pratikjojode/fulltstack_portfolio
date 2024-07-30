// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

app.get("*", function (req, res) {
  res.send(path.join(__dirname, "./client/build/index.html"));
});
// static files
app.use(express.static(path.join(__dirname, "./client/build")));
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other email services if needed
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// API Endpoint for Contact Form
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: `New message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }
    res.status(200).json({ message: "Message sent successfully!" });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
