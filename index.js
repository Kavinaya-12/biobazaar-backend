// const dotenv = require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require("cors")
// const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes')
// const profileRoutes = require('./routes/profileRoutes');
// const path = require('path');
// const cartRoutes = require('./routes/cartRoutes');


// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Connected to database"))
//     .catch(err => console.error("Failed to connect:", err));

// app.use(cors());
// app.use('/products', productRoutes);
// app.use("/user", userRoutes);
// app.use('/profile', profileRoutes);
// app.use('/cart', cartRoutes);

// app.listen(8000, () => {
//     console.log("Server is running on port 8000");
// });





const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Routes
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/user", userRoutes);
app.use("/profile", profileRoutes);

// Serve React in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Connect to MongoDB
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Failed to connect:", err));
